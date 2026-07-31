import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-native-folder'

const nativeFolderWorkspaceRegex = /^html:\/\/\/dropped-files\/\d+\/\d+\/native-folder\/$/

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const directoryHandle = { kind: 'directory', name: 'native-folder' }

  await Workspace.setPath('')
  const itemId = await FileSystem.registerFileHandle({ kind: 'file', type: '', value: directoryHandle } as any)

  await Command.execute('Main.handleDrop', [itemId])

  const workspacePath = await Command.execute('Workspace.getPath')
  assert(nativeFolderWorkspaceRegex.test(workspacePath), `Expected native folder workspace path, got ${workspacePath}`)
}
