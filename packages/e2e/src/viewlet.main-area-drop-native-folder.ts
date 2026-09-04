import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-native-folder'

const nativeFolderWorkspaceRegex = /^html:\/\/\/dropped-files\/\d+\/\d+\/native-folder\/$/

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, DragAndDrop, Workspace }) => {
  const directoryHandle = { kind: 'directory', name: 'native-folder' } as FileSystemDirectoryHandle

  await Workspace.setPath('')
  const dropId = await DragAndDrop.createDropSession([{ fileSystemHandle: directoryHandle, kind: 'file', type: '' }])

  await Command.execute('Main.handleDrop', dropId)

  let workspacePath = await Command.execute('Workspace.getPath')
  for (let attempt = 0; !nativeFolderWorkspaceRegex.test(workspacePath) && attempt < 60; attempt++) {
    await new Promise(requestAnimationFrame)
    workspacePath = await Command.execute('Workspace.getPath')
  }
  assert(nativeFolderWorkspaceRegex.test(workspacePath), `Expected native folder workspace path, got ${workspacePath}`)
}
