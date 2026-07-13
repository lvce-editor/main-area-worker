import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const excludedTests = new Set([
  'viewlet.main-area-auto-modified-status.ts',
  'viewlet.main-area-close-active-editor-saves-modified-content.ts',
  'viewlet.main-area-close-tabs-right.ts',
  'viewlet.main-area-editor-type-character.ts',
  'viewlet.main-area-focus-next-tab-cycle.ts',
  'viewlet.main-area-focus-next-tab.ts',
  'viewlet.main-area-focus-previous-tab-cycle.ts',
  'viewlet.main-area-focus-previous-tab.ts',
  'viewlet.main-area-open-css-file.ts',
  'viewlet.main-area-open-html-file.ts',
  'viewlet.main-area-open-txt-file.ts',
  'viewlet.main-area-open-uris-second-already-exists.ts',
  'viewlet.main-area-restore-closed-tab-existing-uri.ts',
  'viewlet.main-area-restore-closed-tab-middle.ts',
  'viewlet.main-area-restore-closed-tab-recreate-group.ts',
  'viewlet.main-area-restore-closed-tab-three-groups.ts',
  'viewlet.main-area-tab-switching.ts',
  'viewlet.main-area-toggle-preview-html-file.ts',
])

const cwd = process.cwd()
const tmpRoot = join(cwd, '.tmp')
const tmpTestPath = join(tmpRoot, 'e2e-webkit')
const sourcePath = join(cwd, 'src')
const fixturesPath = join(cwd, 'fixtures')
const testBatchSize = 10

const copyWebkitTests = async (entries, batchIndex) => {
  const relativeTestPath = join('.tmp', 'e2e-webkit', String(batchIndex))
  const absoluteTestPath = join(cwd, relativeTestPath)
  const tmpSourcePath = join(absoluteTestPath, 'src')
  const tmpFixturesPath = join(absoluteTestPath, 'fixtures')
  await mkdir(tmpSourcePath, { recursive: true })

  for (const entry of entries) {
    await cp(join(sourcePath, entry.name), join(tmpSourcePath, entry.name))
  }

  await cp(fixturesPath, tmpFixturesPath, { recursive: true })
  return relativeTestPath
}

const getWebkitTests = async () => {
  const entries = await readdir(sourcePath, { withFileTypes: true })
  return entries.filter((entry) => entry.isFile() && !excludedTests.has(entry.name))
}

const run = async (testPath) => {
  const args = [
    './node_modules/@lvce-editor/test-with-playwright/bin/test-with-playwright.js',
    '--only-extension=.',
    `--test-path=${testPath}`,
    '--browser=webkit',
    ...process.argv.slice(2),
  ]

  const child = spawn(process.execPath, args, {
    cwd,
    stdio: 'inherit',
  })

  return new Promise((resolve) => {
    child.on('exit', resolve)
  })
}

try {
  await rm(tmpTestPath, { force: true, recursive: true })
  const tests = await getWebkitTests()
  for (let index = 0; index < tests.length; index += testBatchSize) {
    const batch = tests.slice(index, index + testBatchSize)
    const testPath = await copyWebkitTests(batch, index / testBatchSize)
    const code = await run(testPath)
    if (code !== 0) {
      process.exitCode = code ?? 1
      break
    }
  }
} finally {
  await rm(tmpTestPath, { force: true, recursive: true })
}
