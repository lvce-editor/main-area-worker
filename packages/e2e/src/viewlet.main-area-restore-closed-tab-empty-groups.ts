import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-empty-groups'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Main.splitRight()
  await Command.execute('Main.restoreClosedTab')

  const savedState = await Main.saveState(2)
  assert(savedState.layout.groups.length === 2, `Expected 2 groups after restore, got ${savedState.layout.groups.length}`)
}
