import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-grid-empty'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9006
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.setEditorLayoutGrid', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.direction === 1, `Expected horizontal layout, got ${savedState.layout.direction}`)
  assert(savedState.layout.groups.length === 4, `Expected 4 groups, got ${savedState.layout.groups.length}`)
  assert(
    savedState.layout.groups.every((group) => group.direction === 2),
    'Expected all grid groups to be vertical nested groups',
  )
  assert(
    savedState.layout.groups.every((group) => group.size === 25),
    'Expected four equal grid cells',
  )
}
