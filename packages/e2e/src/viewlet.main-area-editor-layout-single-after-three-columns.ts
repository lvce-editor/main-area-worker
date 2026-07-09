import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-single-after-three-columns'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9028
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.setEditorLayoutThreeColumns', uid)
  await Command.execute('MainArea.setEditorLayoutSingle', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 1, `Expected 1 group, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].size === 100, `Expected size 100, got ${savedState.layout.groups[0].size}`)
}
