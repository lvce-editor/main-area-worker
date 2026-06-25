import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const excludedTests = new Set([
  'viewlet.main-area-auto-modified-status.ts',
  'viewlet.main-area-close-active-editor-saves-modified-content.ts',
  'viewlet.main-area-editor-type-character.ts',
  'viewlet.main-area-restore-closed-tab-three-groups.ts',
])

const windowsTests = new Set(['viewlet.main-area-close-active-editor-no-tabs.ts', 'viewlet.main-area-close-active-editor-one-tab.ts'])

const cwd = process.cwd()
const isWindows = process.platform === 'win32'
const tmpRoot = join(cwd, '.tmp')
const tmpTestPath = join(tmpRoot, 'e2e-webkit')
const tmpSourcePath = join(tmpTestPath, 'src')
const tmpFixturesPath = join(tmpTestPath, 'fixtures')
const sourcePath = join(cwd, 'src')
const fixturesPath = join(cwd, 'fixtures')

const copyWebkitTests = async () => {
  await rm(tmpTestPath, { force: true, recursive: true })
  await mkdir(tmpSourcePath, { recursive: true })

  const entries = await readdir(sourcePath, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isFile() || excludedTests.has(entry.name) || (isWindows && !windowsTests.has(entry.name))) {
      continue
    }
    await cp(join(sourcePath, entry.name), join(tmpSourcePath, entry.name))
  }

  await cp(fixturesPath, tmpFixturesPath, { recursive: true })
}

const run = async () => {
  const args = [
    './node_modules/@lvce-editor/test-with-playwright/bin/test-with-playwright.js',
    '--only-extension=.',
    '--test-path=.tmp/e2e-webkit',
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
  await copyWebkitTests()
  const code = await run()
  process.exitCode = code ?? 1
} finally {
  await rm(tmpTestPath, { force: true, recursive: true })
}
