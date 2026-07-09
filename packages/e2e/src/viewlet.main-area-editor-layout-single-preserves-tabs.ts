import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-single-preserves-tabs'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/one.txt`
  const file2 = `${tmpDir}/two.txt`
  const uid = 9025
  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, { uri: file1 })
  await Command.execute('MainArea.openUri', uid, { uri: file2 })
  await Command.execute('MainArea.setEditorLayoutSingle', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 1, `Expected 1 group, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState.layout.groups[0].tabs.length}`)
}
