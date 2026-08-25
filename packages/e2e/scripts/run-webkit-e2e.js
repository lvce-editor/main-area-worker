import { spawn } from 'node:child_process'
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const excludedTests = new Set([
  'viewlet.main-area-auto-modified-status.ts',
  'viewlet.main-area-close-active-editor-saves-modified-content.ts',
  'viewlet.main-area-close-all-from-middle-of-five-tabs.ts',
  'viewlet.main-area-close-editor-retargets-editor-commands.ts',
  'viewlet.main-area-close-first-of-three-tabs.ts',
  'viewlet.main-area-close-first-twice-of-four-tabs.ts',
  'viewlet.main-area-close-middle-of-three-tabs.ts',
  'viewlet.main-area-close-others-from-first-of-four-tabs.ts',
  'viewlet.main-area-close-others-from-middle-of-five-tabs.ts',
  'viewlet.main-area-close-tabs-right.ts',
  'viewlet.main-area-editor-type-character.ts',
  'viewlet.main-area-focus-next-cycles-four-tabs.ts',
  'viewlet.main-area-focus-next-cycles-two-tabs.ts',
  'viewlet.main-area-focus-next-four-times-from-first.ts',
  'viewlet.main-area-focus-next-single-tab.ts',
  'viewlet.main-area-focus-next-tab-cycle.ts',
  'viewlet.main-area-focus-next-tab.ts',
  'viewlet.main-area-focus-next-then-close-active.ts',
  'viewlet.main-area-focus-next-twice-from-first.ts',
  'viewlet.main-area-focus-previous-cycles-five-tabs.ts',
  'viewlet.main-area-focus-previous-cycles-three-tabs.ts',
  'viewlet.main-area-focus-previous-four-times-from-last.ts',
  'viewlet.main-area-focus-previous-single-tab.ts',
  'viewlet.main-area-focus-previous-tab-cycle.ts',
  'viewlet.main-area-focus-previous-tab.ts',
  'viewlet.main-area-focus-previous-then-close-active.ts',
  'viewlet.main-area-focus-previous-twice-from-last.ts',
  'viewlet.main-area-open-css-file.ts',
  'viewlet.main-area-open-html-file.ts',
  'viewlet.main-area-open-txt-file.ts',
  'viewlet.main-area-open-uris-second-already-exists.ts',
  'viewlet.main-area-restore-closed-tab-existing-uri.ts',
  'viewlet.main-area-restore-closed-tab-middle.ts',
  'viewlet.main-area-restore-closed-tab-recreate-group.ts',
  'viewlet.main-area-restore-closed-tab-three-groups.ts',
  'viewlet.main-area-select-first-of-five-tabs.ts',
  'viewlet.main-area-select-first-of-four-tabs.ts',
  'viewlet.main-area-select-first-of-three-tabs.ts',
  'viewlet.main-area-select-first-of-two-tabs.ts',
  'viewlet.main-area-select-fourth-of-five-tabs.ts',
  'viewlet.main-area-select-middle-of-five-tabs.ts',
  'viewlet.main-area-select-middle-of-three-tabs.ts',
  'viewlet.main-area-select-second-of-four-tabs.ts',
  'viewlet.main-area-select-second-of-six-tabs.ts',
  'viewlet.main-area-select-third-of-four-tabs.ts',
  'viewlet.main-area-tab-switching.ts',
  'viewlet.main-area-toggle-preview-html-file.ts',
])

const cwd = process.cwd()
const sourcePath = join(cwd, 'src')
const fixturesPath = join(cwd, 'fixtures')
const testPath = join(cwd, '.tmp', 'e2e-webkit')
const tmpSourcePath = join(testPath, 'src')
const tmpFixturesPath = join(testPath, 'fixtures')
const testWithPlaywrightPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/test-with-playwright/package.json'))
const testWithPlaywrightPath = join(dirname(testWithPlaywrightPackagePath), 'bin', 'test-with-playwright.js')

const copyTests = async () => {
  await mkdir(tmpSourcePath, { recursive: true })
  const entries = await readdir(sourcePath, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isFile() && !excludedTests.has(entry.name)) {
      await cp(join(sourcePath, entry.name), join(tmpSourcePath, entry.name))
    }
  }
  await cp(fixturesPath, tmpFixturesPath, { recursive: true })
}

const runTests = async () => {
  const args = [
    testWithPlaywrightPath,
    '--only-extension=.',
    '--test-path=.tmp/e2e-webkit',
    '--browser=webkit',
    '--server-path=../server/src/dev.js',
    ...process.argv.slice(2),
  ]
  const child = spawn(process.execPath, args, { cwd, stdio: 'inherit' })
  return new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', resolve)
  })
}

try {
  await rm(testPath, { force: true, recursive: true })
  await copyTests()
  process.exitCode = (await runTests()) ?? 1
} finally {
  await rm(testPath, { force: true, recursive: true })
}
