import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-three-columns-empty'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9003
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.setEditorLayoutThreeColumns', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.direction === 1, `Expected horizontal layout, got ${savedState.layout.direction}`)
  assert(savedState.layout.groups.length === 3, `Expected 3 groups, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups.map((group) => group.size).join(',') === '33.333333,33.333333,33.333334', 'Expected three equal columns')
}
