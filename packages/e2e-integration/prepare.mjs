import { cp, mkdir, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const owner = resolve(here, '../..')
if (!process.argv[2]) throw new Error('Pass the path to a disposable LVCE checkout')
const application = resolve(process.argv[2])
const testFilter = process.argv[3]?.trim()
const manifest = JSON.parse(await readFile(join(application, 'package.json'), 'utf8'))
if (manifest.name !== 'lvce-editor') throw new Error('Expected an LVCE application checkout')
const config = JSON.parse(await readFile(join(here, 'config.json'), 'utf8'))
const tests = join(application, 'packages/extension-host-worker-tests')
// Keep the application's runner and replace only its test inventory.
for (const name of await readdir(join(tests, 'src'))) {
  if (name !== '_all.js') await rm(join(tests, 'src', name), { recursive: true })
}
const sourceTests = await readdir(join(here, 'src'))
const selectedTests = testFilter ? sourceTests.filter((name) => name.includes(testFilter)) : sourceTests
if (testFilter && selectedTests.length === 0) throw new Error(`No integration tests match filter: ${testFilter}`)
for (const name of selectedTests) {
  await cp(join(here, 'src', name), join(tests, 'src', name), { recursive: true })
}
// The application's development test URLs resolve to JavaScript modules.
for (const name of selectedTests) {
  if (!name.endsWith('.ts')) continue
  const source = join(tests, 'src', name)
  await writeFile(source.replace(/\.ts$/, '.js'), stripTypeScriptTypes(await readFile(source, 'utf8')))
  await rm(source)
}
await rm(join(tests, 'fixtures'), { recursive: true, force: true })
await mkdir(join(tests, 'fixtures'), { recursive: true })
try {
  await cp(join(here, 'fixtures'), join(tests, 'fixtures'), { recursive: true })
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
for (const path of config.scripts) {
  await cp(join(here, 'scripts', path.split('/').at(-1)), join(application, path))
}
// Exercise this repository's build in the pinned application runtime.
for (const [from, to] of config.artifacts) {
  const target = await realpath(join(application, to)).catch((error) => {
    if (error.code !== 'ENOENT') throw error
    return join(application, to)
  })
  await cp(join(owner, from), target, { recursive: true })
  // Temporary targeted evidence for the split-save integration investigation.
  if (testFilter === 'save-active-split-editor') {
    const bundlePath = join(target, 'dist/mainAreaWorkerMain.js')
    let bundle = await readFile(bundlePath, 'utf8')
    for (const [marker, label, state] of [
      ['const handleModifiedStatusChange = (state, uri, newStatus) => {', 'modified', '{ uid: state.uid, uri, newStatus, layout: state.layout }'],
      ['const handleClick = (state, name) => {', 'focus', '{ uid: state.uid, name, layout: state.layout }'],
      ['const renderIncremental = (oldState, newState) => {', 'render', '{ uid: newState.uid, layout: newState.layout }'],
    ]) {
      if (!bundle.includes(marker)) throw new Error(`Missing diagnostic marker: ${marker}`)
      bundle = bundle.replace(marker, `${marker}\n console.log('SPLIT_SAVE_${label}', JSON.stringify(${state}));`)
    }
    await writeFile(bundlePath, bundle)
  }
}
