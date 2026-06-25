import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-up-empty-state'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 129
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.splitUp', uid)

  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 2, `Expected split up from empty state to create 2 groups, got ${savedState.layout.groups.length}`)
}
