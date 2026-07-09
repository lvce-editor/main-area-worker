import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-split-down-then-two-columns-bottom'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9031
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.splitDown', uid)
  await Command.execute('MainArea.setEditorLayoutTwoColumnsBottom', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 3, `Expected 3 groups, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups.map((group) => group.size).join(',') === '50,25,25', 'Expected two columns bottom sizes')
}
