import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-workspace-change-clears-groups'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 107
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/workspace-before-1.ts`
  const file2 = `${tmpDir}/workspace-before-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)
  await Command.execute('MainArea.openUri', uid, file2)

  await Command.execute('MainArea.handleWorkspaceChange', uid)

  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.activeGroupId === undefined, 'Expected active group id to be cleared')
  assert(savedState.layout.groups.length === 0, `Expected no groups after workspace change, got ${savedState.layout.groups.length}`)
}
