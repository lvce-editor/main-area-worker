import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const replaceOnce = (source, before, after) => {
  if (source.split(before).length !== 2) {
    throw new Error('Firefox diagnostic target is not unique: ' + before)
  }
  return source.replace(before, after)
}

export const patchFirefoxDiagnostics = async (rendererProcessPath) => {
  let renderer = await readFile(rendererProcessPath, 'utf8')
  if (!renderer.includes('___dualIdeExportTrace')) {
    renderer = replaceOnce(
      renderer,
      'const scheduleExport = () => {',
      'globalThis.___dualIdeExportTrace = exportToDom;\nconst scheduleExport = () => {',
    )
    await writeFile(rendererProcessPath, renderer)
  }
  const requireFromRunner = createRequire(import.meta.resolve('@lvce-editor/test-with-playwright/package.json'))
  const workerManifest = requireFromRunner.resolve('@lvce-editor/test-with-playwright-worker/package.json')
  const workerPath = join(dirname(workerManifest), 'dist', 'workerMain.js')
  let runner = await readFile(workerPath, 'utf8')
  if (runner.includes('dualIdeBrowserEvents')) {
    return
  }
  runner = replaceOnce(
    runner,
    '  let results;\n  try {',
    `  let results;
  const dualIdeBrowserEvents = [];
  const recordDualIdeEvent = (kind, detail) => {
    if (dualIdeBrowserEvents.length < 200) dualIdeBrowserEvents.push({ kind, detail, time: performance.now() });
  };
  page.on('pageerror', error => recordDualIdeEvent('pageerror', error.stack || String(error)));
  page.on('crash', () => recordDualIdeEvent('crash', 'page crashed'));
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') recordDualIdeEvent(message.type(), message.text());
  });
  page.on('requestfailed', request => recordDualIdeEvent('requestfailed', { url: request.url(), failure: request.failure() }));
  try {`,
  )
  runner = replaceOnce(
    runner,
    '    results = [getFailedAllTestsResult(error, start)];',
    `    results = [getFailedAllTestsResult(error, start)];
    if (rendererWorkerTraceDirectory) {
      let snapshot;
      try {
        snapshot = await page.evaluate(() => ({
          url: location.href,
          title: document.title,
          readyState: document.readyState,
          text: document.body?.innerText.slice(0, 20000),
          html: document.documentElement.outerHTML.slice(0, 100000),
        }));
        await page.screenshot({ path: join(rendererWorkerTraceDirectory, 'failure.png'), timeout: 10000 });
      } catch (captureError) {
        recordDualIdeEvent('captureError', String(captureError));
      }
      await writeFile(join(rendererWorkerTraceDirectory, 'failure.json'), JSON.stringify({ error: String(error), events: dualIdeBrowserEvents, snapshot }, null, 2));
    }`,
  )
  runner = replaceOnce(
    runner,
    '      return globalThis.document.querySelector(traceSelector)?.textContent || undefined;',
    `      globalThis.___dualIdeExportTrace?.();
      return globalThis.document.querySelector(traceSelector)?.textContent || undefined;`,
  )
  await writeFile(workerPath, runner)
}
