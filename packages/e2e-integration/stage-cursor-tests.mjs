import { cp, mkdir, readFile, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
if (!process.argv[2]) throw new Error('Pass the path to a disposable LVCE checkout')
const application = resolve(process.argv[2])
const manifest = JSON.parse(await readFile(join(application, 'package.json'), 'utf8'))
if (manifest.name !== 'lvce-editor') throw new Error('Expected an LVCE application checkout')
const paths = [
  ...['down', 'left', 'right', 'unsplit', 'up'].map((direction) => `src/viewlet.main-editor-cursor-after-split-${direction}.js`),
  'fixtures/editor-cursor-split.js',
  'scripts/test-editor-cursor-splits.mjs',
]
const tests = join(application, 'packages/extension-host-worker-tests')
for (const path of paths) {
  const target = join(tests, path)
  if (process.argv.includes('--clean')) {
    await rm(target, { force: true })
  } else {
    await mkdir(dirname(target), { recursive: true })
    await cp(join(here, path), target)
  }
}
