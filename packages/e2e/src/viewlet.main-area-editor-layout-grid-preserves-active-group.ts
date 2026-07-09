import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-grid-preserves-active-group'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9027
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.splitRight', uid)
  const before = await Command.execute('MainArea.saveState', uid)
  await Command.execute('MainArea.setEditorLayoutGrid', uid)
  const after = await Command.execute('MainArea.saveState', uid)

  assert(after.layout.activeGroupId === before.layout.activeGroupId, 'Expected active group to be preserved')
  assert(after.layout.groups.length === 4, `Expected 4 groups, got ${after.layout.groups.length}`)
}
