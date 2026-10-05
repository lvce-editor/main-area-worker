import { createRequire } from 'node:module'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const harnessPath = fileURLToPath(import.meta.resolve('@lvce-editor/test-with-playwright/package.json'))
const harness = JSON.parse(await readFile(harnessPath, 'utf8'))
const workerName = Object.keys(harness.dependencies).find((name) => name.endsWith('/test-with-playwright-worker'))
if (!workerName) throw new Error('Harness worker dependency not found')
const workerPath = createRequire(harnessPath).resolve(workerName)
const source = await readFile(workerPath, 'utf8')
const start = source.indexOf('const runTests = async ({')
const end = source.indexOf('const testResultsSelector =', start)
if (start < 0 || end < 0) throw new Error('RunTests section missing')
let section = source.slice(start, end)
const replaceOnce = (before, after) => {
  if (section.split(before).length !== 2) throw new Error('Browser isolation target not unique')
  section = section.replace(before, after)
}
replaceOnce(
  '  for (const test of filteredTests) {\n',
  `  for (const test of filteredTests) {
    const isolatedBrowser = await startBrowser({ browser, headless, signal: new AbortController().signal });
    const page = isolatedBrowser.page;
    try {
`,
)
replaceOnce(
  '    skipped += resultCounts.skipped;\n  }',
  `    skipped += resultCounts.skipped;
    } finally {
      await isolatedBrowser.dispose();
    }
  }`,
)
await writeFile(workerPath, source.slice(0, start) + section + source.slice(end))
console.log(`Installed per-scenario browser isolation in harness ${harness.version}`)
