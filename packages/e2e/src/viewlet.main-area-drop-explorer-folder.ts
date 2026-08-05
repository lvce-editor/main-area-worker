import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-explorer-folder'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const folderPath = `${tmpDir}/explorer-folder`
  const expectedWorkspacePath = folderPath.slice('file://'.length)

  await FileSystem.mkdir(folderPath)
  await Workspace.setPath(tmpDir)
  const itemId = await FileSystem.registerFileHandle({ kind: 'string', type: 'text/uri-list', value: folderPath } as any)

  await Command.execute('Main.handleDrop', [itemId])

  const workspacePath = await Command.execute('Workspace.getPath')
  assert(workspacePath === expectedWorkspacePath, `Expected workspace path ${expectedWorkspacePath}, got ${workspacePath}`)
}
