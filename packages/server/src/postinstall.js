import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const staticServerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json'))
const serverPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/server/package.json'))
const serverStaticPath = join(dirname(staticServerPackagePath), 'static')
const serverPath = join(dirname(serverPackagePath), 'src', 'server.js')

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')
const diffViewWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'diff-view', 'dist', 'diffViewWorkerMain.js')
const testWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'test-worker', 'dist', 'testWorkerMain.js')

const missingDialogWorkerRelay = 'Command "SendMessagePortToExtensionHostWorker.sendMessagePortToDialogWorker" not found'

const content = await readFile(rendererWorkerMainPath, 'utf-8')

const workerPath = join(root, '.tmp/dist/dist/mainAreaWorkerMain.js')

const remoteUrl = getRemoteUrl(workerPath)
if (!content.includes('// const mainAreaWorkerUrl = ')) {
  await cp(rendererWorkerMainPath, rendererWorkerMainPath + '.original')
  const occurrence = `const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\``
  const replacement = `// const mainAreaWorkerUrl = \`\${assetDir}/packages/main-area-worker/dist/mainAreaWorkerMain.js\`
const mainAreaWorkerUrl = \`${remoteUrl}\``

  const newContent = content.replace(occurrence, replacement)
  await writeFile(rendererWorkerMainPath, newContent)
}

const rendererWorkerContent = await readFile(rendererWorkerMainPath, 'utf-8')
if (!rendererWorkerContent.includes(missingDialogWorkerRelay)) {
  const occurrence =
    /const sendMessagePortToDialogWorker = async \(port, initialCommand\) => \{\n  object\(port\);\n  string\(initialCommand\);\n  await invokeAndTransfer[^\n(]*\(initialCommand, port\);\n\};/
  if (!occurrence.test(rendererWorkerContent)) {
    throw new Error('renderer dialog worker relay occurrence not found')
  }
  const replacement = `const sendMessagePortToDialogWorker = async () => {
  throw new Error('${missingDialogWorkerRelay}');
};`
  const newRendererWorkerContent = rendererWorkerContent.replace(occurrence, replacement)
  await writeFile(rendererWorkerMainPath, newRendererWorkerContent)
}

const diffViewContent = await readFile(diffViewWorkerMainPath, 'utf-8')
if (!diffViewContent.includes("'DiffView.getKeyBindings'")) {
  const occurrence = `const commandMap = {
  'Diff.getCommandIds': getCommandIds,`
  if (!diffViewContent.includes(occurrence)) {
    throw new Error('diff view command map occurrence not found')
  }
  const replacement = `const getKeyBindings = () => []

const commandMap = {
  'Diff.getCommandIds': getCommandIds,
  'DiffView.getKeyBindings': getKeyBindings,`
  const newContent = diffViewContent.replace(occurrence, replacement)
  await writeFile(diffViewWorkerMainPath, newContent)
}

const testWorkerContent = await readFile(testWorkerMainPath, 'utf-8')
if (!testWorkerContent.includes('const openUris = async uris => {')) {
  const openUriOccurrence = `const openUri = async uri => {
  await invoke('Main.openUri', uri);
};`
  const openUrisReplacement = `${openUriOccurrence}
const openUris = async uris => {
  await invoke('Main.openUris', uris);
};`
  const mainOccurrence = `  openUri,
  save,`
  const mainReplacement = `  openUri,
  openUris,
  save,`
  if (!testWorkerContent.includes(openUriOccurrence) || !testWorkerContent.includes(mainOccurrence)) {
    throw new Error('test worker main open uri occurrence not found')
  }
  const newTestWorkerContent = testWorkerContent.replace(openUriOccurrence, openUrisReplacement).replace(mainOccurrence, mainReplacement)
  await writeFile(testWorkerMainPath, newTestWorkerContent)
}

const serverContent = await readFile(serverPath, 'utf-8')
let newServerContent = serverContent
if (!newServerContent.includes('const { socket } = res') && !newServerContent.includes('if (res.socket && !hasErrorListener.has(res.socket))')) {
  const occurrence = `  if (!hasErrorListener.has(res.socket)) {
    res.socket.on('error', handleSocketError)
    hasErrorListener.add(res.socket)
  }`
  if (!newServerContent.includes(occurrence)) {
    throw new Error('server socket error listener occurrence not found')
  }
  const replacement = `  const { socket } = res
  if (socket && !hasErrorListener.has(socket)) {
    socket.on('error', handleSocketError)
    hasErrorListener.add(socket)
  }`
  newServerContent = newServerContent.replace(occurrence, replacement)
}

if (!newServerContent.includes('if (!socket) {')) {
  const occurrence = `const sendHandleSharedProcess = async (request, socket, method, ...params) => {
  request.on('error', handleRequestError)
  socket.on('error', handleSocketUpgradeError)`
  if (!newServerContent.includes(occurrence)) {
    throw new Error('server shared process socket occurrence not found')
  }
  const replacement = `const sendHandleSharedProcess = async (request, socket, method, ...params) => {
  if (!socket) {
    return
  }
  request.on('error', handleRequestError)
  socket.on('error', handleSocketUpgradeError)`
  newServerContent = newServerContent.replace(occurrence, replacement)
}

if (newServerContent !== serverContent) {
  await writeFile(serverPath, newServerContent)
}
