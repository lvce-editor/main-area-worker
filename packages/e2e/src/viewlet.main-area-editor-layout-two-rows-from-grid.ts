import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-two-rows-from-grid'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9015
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.setEditorLayoutGrid', uid)
  await Command.execute('MainArea.setEditorLayoutTwoRows', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.direction === 2, `Expected vertical layout, got ${savedState.layout.direction}`)
  assert(savedState.layout.groups.length === 2, `Expected 2 groups, got ${savedState.layout.groups.length}`)
  assert(
    savedState.layout.groups.every((group) => group.direction === undefined),
    'Expected flat rows',
  )
}
