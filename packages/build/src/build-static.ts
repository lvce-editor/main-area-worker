import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/main-area-worker'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
  testPath: 'packages/e2e',
})

const rendererWorkerPath = join(root, 'dist', commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const mainAreaWorkerDistPath = join(root, 'dist', commitHash, 'packages', 'main-area-worker', 'dist', 'mainAreaWorkerMain.js')
const editorWorkerPath = join(root, 'dist', commitHash, 'packages', 'editor-worker', 'dist', 'editorWorkerMain.js')

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
if (!content.includes(occurrence)) {
  throw new Error('occurrence not found')
}
if (!content.includes(saveReturnOccurrence)) {
  throw new Error('save return occurrence not found')
}
const contentWithMainAreaWorkerUrl = content.replace(occurrence, replacement)
const contentWithSaveReturnValue = contentWithMainAreaWorkerUrl.replace(saveReturnOccurrence, saveReturnReplacement)
await writeFile(rendererWorkerPath, contentWithSaveReturnValue)
await cp(workerPath, mainAreaWorkerDistPath)

const editorWorkerContent = await readFile(editorWorkerPath, 'utf8')
const normalSaveOccurrence = `    return {
      ...newEditor,
      modified: false
    };`
const normalSaveReplacement = `    await invoke$7('Main.handleModifiedStatusChange', uri, false);
    return {
      ...newEditor,
      modified: false
    };`
const untitledSaveOccurrence = `        return {
          ...newEditor,
          modified: false,
          uri: pickedFilePath
        };`
const untitledSaveReplacement = `        await invoke$7('Main.handleModifiedStatusChange', pickedFilePath, false);
        return {
          ...newEditor,
          modified: false,
          uri: pickedFilePath
        };`
if (!editorWorkerContent.includes(normalSaveOccurrence)) {
  throw new Error('normal save occurrence not found')
}
if (!editorWorkerContent.includes(untitledSaveOccurrence)) {
  throw new Error('untitled save occurrence not found')
}
const contentWithNormalSaveNotification = editorWorkerContent.replace(normalSaveOccurrence, normalSaveReplacement)
const contentWithSaveNotifications = contentWithNormalSaveNotification.replace(untitledSaveOccurrence, untitledSaveReplacement)
await writeFile(editorWorkerPath, contentWithSaveNotifications)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
