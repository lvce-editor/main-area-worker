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
const dragAndDropWorkerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/drag-and-drop-worker/package.json'))
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
const dragAndDropWorkerMainPath = join(dirname(dragAndDropWorkerPackagePath), 'dist', 'dragAndDropWorkerMain.js')
const dragAndDropWorkerRemoteUrl = getRemoteUrl(dragAndDropWorkerMainPath)

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

const dragAndDropCommand = 'SendMessagePortToExtensionHostWorker.sendMessagePortToDragAndDropWorker'
let rendererWorkerContent = await readFile(rendererWorkerMainPath, 'utf-8')
if (!rendererWorkerContent.includes(dragAndDropCommand)) {
  const commandOccurrence = `  'SendMessagePortToExtensionHostWorker.sendMessagePortToEditorWorker': lazy('SendMessagePortToExtensionHostWorker.sendMessagePortToEditorWorker'),`
  const commandReplacement = `  '${dragAndDropCommand}': lazy('${dragAndDropCommand}'),
${commandOccurrence}`
  const launcherOccurrence = `const {
  invokeAndTransfer: invokeAndTransfer$d
} = getOrCreateWorker(launchDiffWorker);`
  const launcherReplacement = `${launcherOccurrence}

const dragAndDropWorkerUrl = '${dragAndDropWorkerRemoteUrl}';

const launchDragAndDropWorker = async () => {
  const name = 'Drag And Drop Worker';
  const ipc = await create$19({
    method: ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl$1('develop.dragAndDropWorkerPath', dragAndDropWorkerUrl)
  });
  handleIpc(ipc);
  return ipc;
};

const {
  invokeAndTransfer: invokeAndTransferDragAndDropWorker
} = getOrCreateWorker(launchDragAndDropWorker);`
  const sendOccurrence = `const sendMessagePortToDiffWorker = async (port, initialCommand, rpcId) => {
  object(port);
  string(initialCommand);
  await invokeAndTransfer$d(initialCommand, port, rpcId);
};`
  const sendReplacement = `${sendOccurrence}
const sendMessagePortToDragAndDropWorker = async (port) => {
  object(port);
  await invokeAndTransferDragAndDropWorker('DragAndDrop.handleMessagePort', port);
};`
  const exportOccurrence = `  sendMessagePortToDiffWorker: sendMessagePortToDiffWorker,`
  const exportReplacement = `${exportOccurrence}
  sendMessagePortToDragAndDropWorker: sendMessagePortToDragAndDropWorker,`
  for (const occurrence of [commandOccurrence, launcherOccurrence, sendOccurrence, exportOccurrence]) {
    if (!rendererWorkerContent.includes(occurrence)) {
      throw new Error(`renderer drag and drop worker occurrence not found: ${occurrence}`)
    }
  }
  rendererWorkerContent = rendererWorkerContent
    .replace(commandOccurrence, commandReplacement)
    .replace(launcherOccurrence, launcherReplacement)
    .replace(sendOccurrence, sendReplacement)
    .replace(exportOccurrence, exportReplacement)
}

const bundledDragAndDropWorkerUrl = 'const dragAndDropWorkerUrl = `${assetDir}/packages/drag-and-drop-worker/dist/dragAndDropWorkerMain.js`;'
const remoteDragAndDropWorkerUrl = `const dragAndDropWorkerUrl = '${dragAndDropWorkerRemoteUrl}';`
if (!rendererWorkerContent.includes(bundledDragAndDropWorkerUrl) && !rendererWorkerContent.includes(remoteDragAndDropWorkerUrl)) {
  throw new Error('renderer drag and drop worker url occurrence not found')
}
rendererWorkerContent = rendererWorkerContent.replace(bundledDragAndDropWorkerUrl, remoteDragAndDropWorkerUrl)

const missingDialogWorkerRelay = 'Command "SendMessagePortToExtensionHostWorker.sendMessagePortToDialogWorker" not found'
if (!rendererWorkerContent.includes(missingDialogWorkerRelay)) {
  const occurrence =
    /const sendMessagePortToDialogWorker = async \(port, initialCommand\) => \{\n  object\(port\);\n  string\(initialCommand\);\n  await invokeAndTransfer[^\n(]*\(initialCommand, port\);\n\};/
  if (!occurrence.test(rendererWorkerContent)) {
    throw new Error('renderer dialog worker relay occurrence not found')
  }
  const replacement = `const sendMessagePortToDialogWorker = async () => {
  throw new Error('${missingDialogWorkerRelay}');
};`
  rendererWorkerContent = rendererWorkerContent.replace(occurrence, replacement)
}
await writeFile(rendererWorkerMainPath, rendererWorkerContent)

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

let compatibleTestWorkerContent = await readFile(testWorkerMainPath, 'utf-8')
const workspaceReset = /    await invoke[^\n(]*\('FileSystem\.mkdir', 'memfs:\/\/\/workspace'\);\n    await invoke[^\n(]*\('Layout\.reset'\);/
if (!workspaceReset.test(compatibleTestWorkerContent)) {
  const occurrence = /    await (invoke[^\n(]*)\('Layout\.reset'\);/
  if (!occurrence.test(compatibleTestWorkerContent)) {
    throw new Error('test worker workspace reset occurrence not found')
  }
  const replacement = `    await $1('FileSystem.remove', 'memfs:///workspace');
    await $1('FileSystem.mkdir', 'memfs:///workspace');
    await $1('Layout.reset');`
  compatibleTestWorkerContent = compatibleTestWorkerContent.replace(occurrence, replacement)
}

if (compatibleTestWorkerContent !== testWorkerContent) {
  await writeFile(testWorkerMainPath, compatibleTestWorkerContent)
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
