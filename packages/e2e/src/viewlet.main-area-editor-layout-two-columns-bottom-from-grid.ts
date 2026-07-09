import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-two-columns-bottom-from-grid'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9022
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.setEditorLayoutGrid', uid)
  await Command.execute('MainArea.setEditorLayoutTwoColumnsBottom', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.direction === 2, `Expected vertical layout, got ${savedState.layout.direction}`)
  assert(savedState.layout.groups.length === 3, `Expected 3 groups, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups.map((group) => group.direction).join(',') === ',1,1', 'Expected bottom nested columns')
}
