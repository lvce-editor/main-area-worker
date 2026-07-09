import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-three-columns-from-one-file'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/file.txt`
  const uid = 9023
  await FileSystem.writeFile(file, 'content')
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, { uri: file })
  await Command.execute('MainArea.setEditorLayoutThreeColumns', uid)
  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 3, `Expected 3 groups, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].tabs.length === 1, 'Expected file to remain in first group')
  assert(
    savedState.layout.groups.slice(1).every((group) => group.isEmpty),
    'Expected new columns to be empty',
  )
}
