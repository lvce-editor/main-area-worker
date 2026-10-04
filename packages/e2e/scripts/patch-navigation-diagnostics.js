import { createRequire } from 'node:module'
import { readFile, writeFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
const runner = require.resolve('@lvce-editor/test-with-playwright-worker')
let source = await readFile(runner, 'utf8')
const replaceOnce = (before, after) => {
  if (source.split(before).length !== 2) {
    throw new Error(`Expected exactly one diagnostic patch target: ${before.slice(0, 100)}`)
  }
  source = source.replace(before, after)
}

const replaceInSection = (startMarker, endMarker, before, after) => {
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker, start)
  if (start < 0 || end < 0) throw new Error('Diagnostic function boundaries not found')
  const section = source.slice(start, end)
  if (section.split(before).length !== 2) throw new Error('Diagnostic target is not unique within function')
  replaceOnce(section, section.replace(before, after))
}

replaceOnce(
  'const navigateToTest = async (page, url) => {',
  String.raw`const navigationDiagnostics = new WeakMap();
const initializeNavigationDiagnostics = (page, url) => {
  let state = navigationDiagnostics.get(page);
  if (!state) {
    state = { events: [], url, captured: false };
    const record = (type, details = {}) => {
      state.events.push({ sequence: state.sequence++, time: performance.now(), type, ...details });
      if (state.events.length > 30) state.events.shift();
    };
    state.sequence = 0;
    page.on('request', request => {
      if (request.isNavigationRequest()) record('request', { url: request.url() });
    });
    page.on('response', response => {
      if (response.request().isNavigationRequest()) record('response', { url: response.url(), status: response.status() });
    });
    page.on('requestfailed', request => {
      if (request.isNavigationRequest()) record('requestfailed', { url: request.url(), error: request.failure() });
    });
    page.on('domcontentloaded', () => record('domcontentloaded', { url: page.url() }));
    page.on('crash', () => record('crash'));
    page.on('close', () => record('close'));
    page.context().browser()?.on('disconnected', () => record('disconnected'));
    navigationDiagnostics.set(page, state);
  }
  state.url = url;
};
const captureNavigationFailure = async (page, error) => {
  const state = navigationDiagnostics.get(page);
  if (!state || state.captured) return;
  state.captured = true;
  const capture = {
    wallTime: new Date().toISOString(), time: performance.now(),
    url: state.url, pageUrl: page.url(), pageClosed: page.isClosed(),
    browserConnected: page.context().browser()?.isConnected(),
    error: String(error), events: state.events.slice(),
  };
  const start = performance.now();
  try {
    const response = await fetch(state.url, { signal: AbortSignal.timeout(5000) });
    const body = await response.text();
    capture.httpProbe = { status: response.status, bytes: Buffer.byteLength(body), elapsed: performance.now() - start };
  } catch (probeError) {
    capture.httpProbe = { error: String(probeError), elapsed: performance.now() - start };
  }
  try {
    const { execFile } = await import('node:child_process');
    capture.processes = await new Promise((resolve, reject) => {
      execFile('ps', ['-eo', 'pid,ppid,rss,stat,comm'], (error, stdout) => error ? reject(error) : resolve(stdout));
    });
  } catch (processError) {
    capture.processError = String(processError);
  }
  const directory = join(process.cwd(), '.e2e-artifacts');
  await mkdir(directory, { recursive: true });
  const file = join(directory, 'navigation-' + (process.env.E2E_ATTEMPT || 'ordinary') + '-' + process.pid + '.json');
  await writeFile(file, JSON.stringify(capture, null, 2) + '\n');
  console.log('Navigation failure capture:', file, JSON.stringify(capture.httpProbe));
};
const navigateToTest = async (page, url) => {
  initializeNavigationDiagnostics(page, url);`,
)
replaceInSection(
  'const runTest = async (',
  'const getResultCounts$1',
  'const message = error instanceof Error ? error.message : String(error);\n    return {\n      end,',
  'const message = error instanceof Error ? error.message : String(error);\n    await captureNavigationFailure(page, error);\n    return {\n      end,',
)
replaceInSection(
  'const runTests = async (',
  'const testResultsSelector',
  'skipped += resultCounts.skipped;\n  }\n  const end = performance.now();',
  'skipped += resultCounts.skipped;\n    if (resultCounts.failed) break;\n  }\n  const end = performance.now();',
)
await writeFile(runner, source)
console.log(`Installed test-only navigation diagnostics in ${runner}`)
