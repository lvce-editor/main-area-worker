import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { root } from './root.js'

const sharedProcessUrl = import.meta.resolve('@lvce-editor/shared-process')
const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/main-area-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerDistPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist')
const rendererWorkerFiles = await readdir(rendererWorkerDistPath)
const viewletFileName = rendererWorkerFiles.includes('Viewlet.js')
  ? 'Viewlet.js'
  : rendererWorkerFiles.includes('rendererWorkerMain.js')
    ? 'rendererWorkerMain.js'
    : ''
if (!viewletFileName) {
  throw new Error('renderer worker viewlet bundle not found')
}
const viewletPath = join(rendererWorkerDistPath, viewletFileName)
const rendererProcessPath = join(root, 'dist', commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
const mainAreaWorkerDistPath = join(root, 'dist', commitHash, 'packages', 'main-area-worker', 'dist', 'mainAreaWorkerMain.js')
const staticServerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json'))
const serverRendererProcessPath = join(
  dirname(staticServerPackagePath),
  'static',
  commitHash,
  'packages',
  'renderer-process',
  'dist',
  'rendererProcessMain.js',
)

const workerPath = join(root, '.tmp/dist/dist/mainAreaWorkerMain.js')
// The exported configuration selects this repository's worker through InitData IPC.
const indexHtml = await readFile(join(root, 'dist', 'index.html'), 'utf8')
const configMatch = indexHtml.match(/<script id="Config" type="application\/json">(.*?)<\/script>/)
if (!configMatch) {
  throw new Error('exported runtime configuration not found')
}
const config = JSON.parse(configMatch[1])
if (config.workerUrls?.['develop.mainAreaWorkerPath'] !== `${config.assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js`) {
  throw new Error('exported configuration must select the local main area worker')
}

const content = await readFile(viewletPath, 'utf8')
const saveReturnOccurrence = `|| key === 'getPlatform') {
      return newState;
    }`
const saveReturnReplacement = `|| key === 'getPlatform' || key === 'save') {
      return newState;
    }`
const bundledSaveReturnOccurrence = `|| key === "getPlatform") {
          return newState;
        }`
const bundledSaveReturnReplacement = `|| key === "getPlatform" || key === "save") {
          return newState;
        }`
if (
  !content.includes(saveReturnOccurrence) &&
  !content.includes(saveReturnReplacement) &&
  !content.includes(bundledSaveReturnOccurrence) &&
  !content.includes(bundledSaveReturnReplacement)
) {
  throw new Error('save return occurrence not found')
}
const updatedContent = content.replace(saveReturnOccurrence, saveReturnReplacement).replace(bundledSaveReturnOccurrence, bundledSaveReturnReplacement)
await writeFile(viewletPath, updatedContent)

const addScrollCommandHandlers = (content: string): string => {
  if (content.includes(`'Viewlet.scrollSelectorIntoView':`)) {
    return content
  }
  const marker = `  'Viewlet.send': invoke,`
  if (!content.includes(marker)) {
    throw new Error('renderer process scroll command marker not found')
  }
  const handlers = `  'Viewlet.scrollSelectorBy': (id, selector, delta) => {
    const element = [...document.querySelectorAll(selector)].find((element) => getComponentUid(element) === id);
    if (element instanceof HTMLElement) {
      element.scrollLeft += delta;
    }
  },
  'Viewlet.scrollSelectorIntoView': (id, selector) => {
    const element = [...document.querySelectorAll(selector)].find((element) => getComponentUid(element) === id);
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  },`
  return content.replace(marker, `${handlers}\n${marker}`)
}

for (const path of [rendererProcessPath, serverRendererProcessPath]) {
  const rendererProcessContent = await readFile(path, 'utf8')
  await writeFile(path, addScrollCommandHandlers(rendererProcessContent))
}

await cp(workerPath, mainAreaWorkerDistPath)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
