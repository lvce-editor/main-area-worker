import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-alias-two-columns'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9033
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.setEditorLayoutTwoColumns', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.direction === 1, `Expected horizontal layout, got ${savedState.layout.direction}`)
  assert(savedState.layout.groups.length === 2, `Expected 2 groups, got ${savedState.layout.groups.length}`)
}
