import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-another-editor'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')

  const uid = 5

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  // Open first editor
  await Command.execute('MainArea.openUri', uid, {
    focus: false,
    preview: false,
    uri: file1,
  })

  // Verify first editor is opened
  let savedState = await Command.execute('MainArea.saveState', uid)
  assert(savedState.layout.groups.length === 1, `Expected 1 group, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState.layout.groups[0].tabs.length}`)
  assert(savedState.layout.groups[0].tabs[0].path === file1, `Expected tab path to be ${file1}`)
  assert(savedState.layout.groups[0].activeTabId === savedState.layout.groups[0].tabs[0].id, 'First editor should be active')

  // Open second editor
  await Command.execute('MainArea.openUri', uid, {
    focus: false,
    preview: false,
    uri: file2,
  })

  // Verify both tabs are visible
  savedState = await Command.execute('MainArea.saveState', uid)
  assert(savedState.layout.groups.length === 1, `Expected 1 group, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].tabs.length === 2, `Expected 2 tabs, got ${savedState.layout.groups[0].tabs.length}`)

  // Verify tab paths
  const tab1 = savedState.layout.groups[0].tabs.find((t) => t.path === file1)
  const tab2 = savedState.layout.groups[0].tabs.find((t) => t.path === file2)
  assert(tab1 !== undefined, 'Tab with file1 should exist')
  assert(tab2 !== undefined, 'Tab with file2 should exist')

  // Verify only the second editor is active/visible
  assert(savedState.layout.groups[0].activeTabId === tab2?.id, 'Second editor should be active')
  assert(savedState.layout.groups[0].activeTabId !== tab1?.id, 'First editor should not be active')
}
