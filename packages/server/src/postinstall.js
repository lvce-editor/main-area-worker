import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { patchEditorSelectionDiagnostics, patchRendererCommandTarget, patchRendererSelectionDiagnostics } from './selectionDiagnostics.js'

const staticServerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/static-server/package.json'))
const serverStaticPath = join(dirname(staticServerPackagePath), 'static')
const commitHash = (await readdir(serverStaticPath)).find((entry) => /^[a-z\d]{7}$/.test(entry)) || ''
const packagePath = (...parts) => join(serverStaticPath, commitHash, 'packages', ...parts)

const patchRendererProcess = (content) => {
  if (content.includes("'TestFrameWork.createDropSession': createDropSession")) {
    return content
  }
  const dropStore = content.match(
    /const add\$\d+ = dataTransfer => \{\n  const id = (create\$\w+)\(\);\n  (state\$\w+)\[id\] = retainItems\(dataTransfer\);\n  return id;\n\};/,
  )
  const createWorkerWithPort = content.match(
    /const (create\$\w+) = async \(\{\n  commandMap,\n  name,\n  port,\n  url\n\}\) => \{[\s\S]*?await workerRpc\.invokeAndTransfer\('initialize', 'message-port', port\);/,
  )?.[1]
  const createMessagePortRpc = content.match(
    /const (create\$\w+) = async \(\{\n  commandMap,\n  isMessagePortOpen = true,\n  messagePort\n\}\) => \{/,
  )?.[1]
  if (!dropStore || !createWorkerWithPort || !createMessagePortRpc) {
    throw new Error('renderer process drop session dependencies not found')
  }
  const [, createId, dropDataState] = dropStore
  const implementation = `const retainTestDropItem = (item, index) => {
  if (item.kind === 'string') {
    return { index, kind: 'string', type: item.type, value: Promise.resolve(item.value) };
  }
  return { file: item.file ?? null, fileSystemHandle: Promise.resolve(item.fileSystemHandle), index, kind: 'file', type: item.type };
};
const createDropSession = items => {
  const id = ${createId}();
  ${dropDataState}[id] = items.map(retainTestDropItem);
  return id;
};
const dragAndDropWorkerUrlForTests = \`\${assetDir}/packages/drag-and-drop-worker/dist/dragAndDropWorkerMain.js\`;
let dragAndDropWorkerRpcForTests;
const handleDragAndDropMessagePort = async port => {
  if (!dragAndDropWorkerRpcForTests) {
    const { port1, port2 } = new MessageChannel();
    await ${createWorkerWithPort}({ commandMap: {}, name: 'Drag And Drop Worker', port: port1, url: dragAndDropWorkerUrlForTests });
    dragAndDropWorkerRpcForTests = await ${createMessagePortRpc}({ commandMap: commandMapRef, messagePort: port2 });
  }
  await dragAndDropWorkerRpcForTests.invokeAndTransfer('DragAndDrop.handleMessagePort', port);
};

`
  const command = "  'TestFrameWork.checkSingleElementCondition': checkSingleElementCondition,\n"
  if (!content.includes(command)) {
    throw new Error('renderer process test command map not found')
  }
  return content
    .replace('const commandMap = {', implementation + 'const commandMap = {')
    .replace("  'DropData.get':", "  'DragAndDrop.handleMessagePort': handleDragAndDropMessagePort,\n  'DropData.get':")
    .replace(command, command + "  'TestFrameWork.createDropSession': createDropSession,\n")
}

const rendererProcessPath = packagePath('renderer-process', 'dist', 'rendererProcessMain.js')
const rendererProcess = await readFile(rendererProcessPath, 'utf8')
await writeFile(rendererProcessPath, patchRendererProcess(rendererProcess))

const editorWorkerPath = packagePath('editor-worker', 'dist', 'editorWorkerMain.js')
await writeFile(editorWorkerPath, patchEditorSelectionDiagnostics(await readFile(editorWorkerPath, 'utf8')))
const rendererWorkerPath = packagePath('renderer-worker', 'dist', 'rendererWorkerMain.js')
await writeFile(rendererWorkerPath, patchRendererCommandTarget(patchRendererSelectionDiagnostics(await readFile(rendererWorkerPath, 'utf8'))))

const dragAndDropWorkerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/drag-and-drop-worker/package.json'))
await cp(
  join(dirname(dragAndDropWorkerPackagePath), 'dist', 'dragAndDropWorkerMain.js'),
  packagePath('drag-and-drop-worker', 'dist', 'dragAndDropWorkerMain.js'),
)

const testWorkerPackagePath = fileURLToPath(import.meta.resolve('@lvce-editor/test-worker/package.json'))
await cp(join(dirname(testWorkerPackagePath), 'dist', 'testWorkerMain.js'), packagePath('test-worker', 'dist', 'testWorkerMain.js'))
