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
if (!content.includes(occurrence)) {
  throw new Error('occurrence not found')
}
const editorCommandOccurrence = `    case 'EditorDiagnostics':
      return EditorDiagnostics;`
const editorCommandReplacement = `    case 'Editor':
      return EditorText;
    case 'EditorDiagnostics':
      return EditorDiagnostics;`
if (!content.includes(editorCommandOccurrence)) {
  throw new Error('editor command occurrence not found')
}
const contentWithMainAreaWorkerUrl = content.replace(occurrence, replacement)
const newContent = contentWithMainAreaWorkerUrl.replace(editorCommandOccurrence, editorCommandReplacement)
await writeFile(rendererWorkerPath, newContent)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
