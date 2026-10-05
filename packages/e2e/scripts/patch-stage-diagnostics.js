import { createRequire } from 'node:module'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const harnessPath = fileURLToPath(import.meta.resolve('@lvce-editor/test-with-playwright/package.json'))
const harness = JSON.parse(await readFile(harnessPath, 'utf8'))
const workerName = Object.keys(harness.dependencies).find((name) => name.endsWith('/test-with-playwright-worker'))
if (!workerName) throw new Error('Harness worker dependency not found')
const require = createRequire(harnessPath)
const workerPath = require.resolve(workerName)
let source = await readFile(workerPath, 'utf8')
const replaceOnce = (before, after) => {
  if (source.split(before).length !== 2) throw new Error(`Diagnostic target not unique: ${before.slice(0, 100)}`)
  source = source.replace(before, after)
}
const replaceInSection = (startMarker, endMarker, before, after) => {
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker, start)
  if (start < 0 || end < 0) throw new Error('Diagnostic section missing')
  const section = source.slice(start, end)
  if (section.split(before).length !== 2) throw new Error(`Diagnostic section target not unique: ${before.slice(0, 100)}`)
  replaceOnce(section, section.replace(before, after))
}

source = `import { appendFileSync as diagAppend, mkdirSync as diagMkdir, writeFileSync as diagWrite } from 'node:fs';\nimport { execFileSync as diagExec } from 'node:child_process';\n${source}`
replaceOnce(
  'const navigateToTest = async (page, url, browser) => {',
  String.raw`const diagDirectory = '.e2e-artifacts';
diagMkdir(diagDirectory, { recursive: true });
const diagAttempt = process.env.E2E_ATTEMPT || 'local';
const diagStates = new WeakMap();
let diagCurrent;
const diagPersist = (file, value) => diagWrite(diagDirectory + '/' + file + '-' + diagAttempt + '-' + process.pid + '.json', JSON.stringify(value, null, 2));
const diagBounded = async (run) => {
  let timer;
  try {
    return await Promise.race([run(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('probe timeout after 5s')), 5000); })]);
  } catch (error) {
    return { error: String(error) };
  } finally {
    clearTimeout(timer);
  }
};
const diagCapture = async (page, state, reason) => {
  if (state.captured) return;
  state.captured = true;
  const capture = {
    reason, pid: process.pid, wallTime: new Date().toISOString(),
    stage: { ...state.current }, phaseMilliseconds: performance.now() - state.current.time,
    pageUrl: page.url(), pageClosed: page.isClosed(), browserConnected: page.context().browser()?.isConnected(),
    events: state.events.slice(), pending: [...state.pending.values()].slice(0, 30),
  };
  diagPersist('stall', capture);
  const pageProbe = diagBounded(() => page.evaluate(() => ({
    readyState: document.readyState, url: location.href,
    overlay: document.querySelector('#TestOverlay')?.outerHTML.slice(0, 1000),
    scripts: [...document.scripts].map(script => ({ src: script.src, type: script.type })),
  })));
  const httpProbe = diagBounded(async () => {
    const start = performance.now();
    const response = await fetch(state.current.url || page.url(), { signal: AbortSignal.timeout(5000) });
    const body = await response.text();
    return { status: response.status, bytes: Buffer.byteLength(body), elapsed: performance.now() - start };
  });
  try {
    capture.processes = diagExec('ps', ['-eo', 'pid,ppid,rss,stat,comm'], { encoding: 'utf8', timeout: 5000 }).split('\n').filter(line => /node|WPE|WebKit|PID/.test(line));
  } catch (error) {
    capture.processes = { error: String(error) };
  }
  [capture.pageProbe, capture.httpProbe] = await Promise.all([pageProbe, httpProbe]);
  diagPersist('stall', capture);
};
const diagStage = (page, test, stage, details = {}) => {
  let state = diagStates.get(page);
  if (!state) {
    state = { events: [], pending: new Map(), sequence: 0, captured: false };
    const event = (type, details = {}) => {
      state.events.push({ sequence: state.sequence++, time: performance.now(), type, ...details });
      if (state.events.length > 80) state.events.shift();
    };
    page.on('request', request => {
      if (request.url().startsWith('http://127.0.0.1:')) state.pending.set(request, { url: request.url(), type: request.resourceType(), time: performance.now() });
      if (request.isNavigationRequest()) event('navigation-request', { url: request.url() });
    });
    page.on('response', response => {
      const pending = state.pending.get(response.request());
      if (pending) pending.status = response.status();
      if (response.request().isNavigationRequest()) event('navigation-response', { url: response.url(), status: response.status() });
    });
    page.on('requestfinished', request => state.pending.delete(request));
    page.on('requestfailed', request => { state.pending.delete(request); event('requestfailed', { url: request.url(), error: request.failure() }); });
    page.on('domcontentloaded', () => event('domcontentloaded', { url: page.url() }));
    page.on('load', () => event('load', { url: page.url() }));
    page.on('pageerror', error => event('pageerror', { error: String(error).slice(0, 2000) }));
    page.on('crash', () => event('crash'));
    page.on('close', () => event('close'));
    page.context().browser()?.on('disconnected', () => event('disconnected'));
    diagStates.set(page, state);
  }
  clearTimeout(state.timer);
  state.current = { test, stage, failedFrom: stage === 'failed' ? state.current?.stage : undefined, time: performance.now(), wallTime: new Date().toISOString(), url: details.url || state.current?.url, ...details };
  diagCurrent = state.current;
  diagAppend(diagDirectory + '/stages-' + diagAttempt + '-' + process.pid + '.jsonl', JSON.stringify(state.current) + '\n');
  if (stage.endsWith(':start')) {
    state.timer = setTimeout(() => { void diagCapture(page, state, 'phase stalled for 45s'); }, 45000);
    state.timer.unref();
  }
  if (stage === 'failed') void diagCapture(page, state, 'test failure');
};
setInterval(() => diagPersist('heartbeat', { wallTime: new Date().toISOString(), time: performance.now(), stage: diagCurrent }), 5000).unref();
const navigateToTest = async (page, url, browser) => {`,
)

const runTestStart = 'const runTest = async ({'
const runTestEnd = 'const getResultCounts$1 ='
const patchRunTest = (before, after) => replaceInSection(runTestStart, runTestEnd, before, after)
patchRunTest('  try {\n', "  diagStage(page, test, 'prepare:start');\n  try {\n")
patchRunTest(
  '    await navigateToTest(page, url, browser);',
  "    diagStage(page, test, 'goto:start', { url });\n    await navigateToTest(page, url, browser);\n    diagStage(page, test, 'goto:done');",
)
patchRunTest(
  '    await expect(testOverlay).toBeVisible({',
  "    diagStage(page, test, 'visible:start');\n    await expect(testOverlay).toBeVisible({",
)
patchRunTest(
  '    const text = await testOverlay.textContent();',
  "    diagStage(page, test, 'visible:done');\n    diagStage(page, test, 'textContent:start');\n    const text = await testOverlay.textContent();\n    diagStage(page, test, 'textContent:done');",
)
patchRunTest(
  "    const testOverlayState = await testOverlay.getAttribute('data-state');",
  "    diagStage(page, test, 'getAttribute:start');\n    const testOverlayState = await testOverlay.getAttribute('data-state');\n    diagStage(page, test, 'getAttribute:done');",
)
patchRunTest(
  '    const end = performance.now();\n    return {',
  "    diagStage(page, test, 'complete');\n    const end = performance.now();\n    return {",
)
patchRunTest(
  '    const message = error instanceof Error ? error.message : String(error);',
  "    const message = error instanceof Error ? error.message : String(error);\n    diagStage(page, test, 'failed', { error: message.slice(0, 2000) });",
)
replaceInSection(
  'const runTests = async ({',
  'const testResultsSelector =',
  '    await onResult(result);',
  "    diagStage(page, test, 'report:start');\n    await onResult(result);\n    diagStage(page, test, 'report:done');",
)
await writeFile(workerPath, source)
console.log(`Installed stage diagnostics in harness ${harness.version}: ${workerPath}`)
