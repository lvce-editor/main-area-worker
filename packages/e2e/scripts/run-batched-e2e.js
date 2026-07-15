import { spawn } from 'node:child_process'
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

const cwd = process.cwd()
const tmpRoot = join(cwd, '.tmp')
const sourcePath = join(cwd, 'src')
const fixturesPath = join(cwd, 'fixtures')

const copyTests = async (entries, browser, batchIndex) => {
  const relativeTestPath = join('.tmp', `e2e-${browser}`, String(batchIndex))
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

const getTests = async (excludedTests) => {
  const entries = await readdir(sourcePath, { withFileTypes: true })
  return entries.filter((entry) => entry.isFile() && !excludedTests.has(entry.name)).toSorted((a, b) => a.name.localeCompare(b.name))
}

const run = async (browser, testPath, forwardedArgs) => {
  const args = [
    './node_modules/@lvce-editor/test-with-playwright/bin/test-with-playwright.js',
    '--only-extension=.',
    `--test-path=${testPath}`,
    `--browser=${browser}`,
    ...forwardedArgs,
  ]

  const child = spawn(process.execPath, args, {
    cwd,
    stdio: 'inherit',
  })

  return new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', resolve)
  })
}

export const runBatchedE2E = async ({ browser, excludedTests = new Set(), forwardedArgs, maxAttempts = 2, testBatchSize }) => {
  const tmpTestPath = join(tmpRoot, `e2e-${browser}`)
  try {
    await rm(tmpTestPath, { force: true, recursive: true })
    const tests = await getTests(excludedTests)
    for (let index = 0; index < tests.length; index += testBatchSize) {
      const batch = tests.slice(index, index + testBatchSize)
      const testPath = await copyTests(batch, browser, index / testBatchSize)
      let code = 1
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        code = await run(browser, testPath, forwardedArgs)
        if (code === 0) {
          break
        }
        if (attempt < maxAttempts) {
          console.log(`Retrying ${browser} E2E batch ${index / testBatchSize + 1}`)
        }
      }
      if (code !== 0) {
        return code ?? 1
      }
    }
    return 0
  } finally {
    await rm(tmpTestPath, { force: true, recursive: true })
  }
}
