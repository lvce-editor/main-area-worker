import { cp, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { root } from './root.js'

const sharedProcessUrl = import.meta.resolve('@lvce-editor/shared-process')
const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/main-area-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
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

export const getRemoteUrl = (path: string): string => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const content = await readFile(rendererWorkerPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/mainAreaWorkerMain.js')
const remoteUrl = getRemoteUrl(workerPath)

const occurrence = `// const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\`
const mainAreaWorkerUrl = \`${remoteUrl}\``
const replacement = `const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\``
const saveReturnOccurrence = `|| key === 'getPlatform') {
      return newState;
    }`
const saveReturnReplacement = `|| key === 'getPlatform' || key === 'save') {
      return newState;
    }`
if (!content.includes(occurrence) && !content.includes(replacement)) {
  throw new Error('occurrence not found')
}
if (!content.includes(saveReturnOccurrence)) {
  throw new Error('save return occurrence not found')
}
const contentWithMainAreaWorkerUrl = content.includes(occurrence) ? content.replace(occurrence, replacement) : content
const contentWithSaveReturnValue = contentWithMainAreaWorkerUrl.replace(saveReturnOccurrence, saveReturnReplacement)
await writeFile(rendererWorkerPath, contentWithSaveReturnValue)

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
