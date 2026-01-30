import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-editor-split-horizontal'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`

  await FileSystem.writeFile(file1, 'export const hello = () => "world"')

  const uid = 3

  // Create main area
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  // Open first file
  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: file1,
  })

  // Verify the file is opened
  const savedState1 = await Command.execute('MainArea.saveState', uid)
  assert(savedState1.layout.groups.length === 1, `Expected 1 group, got ${savedState1.layout.groups.length}`)
  assert(savedState1.layout.groups[0].tabs.length === 1, `Expected 1 tab in the first group, got ${savedState1.layout.groups[0].tabs.length}`)
  assert(savedState1.layout.groups[0].tabs[0].path === file1, `Expected file1 to be opened, got ${savedState1.layout.groups[0].tabs[0].path}`)

  // Get the group ID for splitting
  const groupId = savedState1.layout.groups[0].id

  // Split the group horizontally (split-right)
  await Command.execute('MainArea.handleClick', uid, 'split-right', { groupId: String(groupId) })

  // Verify the split occurred
  const savedState2 = await Command.execute('MainArea.saveState', uid)
  assert(savedState2.layout.groups.length === 2, `Expected 2 groups, got ${savedState2.layout.groups.length}`)
  assert(savedState2.layout.direction === 'horizontal', `Expected horizontal direction, got ${savedState2.layout.direction}`)

  // Verify the first group still has the file
  assert(savedState2.layout.groups[0].tabs.length === 1, `Expected 1 tab in the first group, got ${savedState2.layout.groups[0].tabs.length}`)
  assert(savedState2.layout.groups[0].tabs[0].path === file1, `Expected file1 in first group, got ${savedState2.layout.groups[0].tabs[0].path}`)

  // Verify the second group is empty
  assert(savedState2.layout.groups[1].tabs.length === 0, `Expected 0 tabs in the second group, got ${savedState2.layout.groups[1].tabs.length}`)
}
