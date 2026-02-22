import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-first-already-exists'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 103
  const file1 = `${tmpDir}/open-uris-existing-1.ts`
  const file2 = `${tmpDir}/open-uris-existing-2.ts`

  await FileSystem.writeFile(file1, 'export const existing = 1')
  await FileSystem.writeFile(file2, 'export const newFile = 2')

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, { uri: file1 })
  await Command.execute('MainArea.openUris', uid, [file1, file2])

  const savedState = await Command.execute('MainArea.saveState', uid)
  const [group] = savedState.layout.groups
  assert(group.tabs.length === 2, `Expected 2 tabs, got ${group.tabs.length}`)

  const file1Tabs = group.tabs.filter((tab: any) => tab.uri === file1)
  assert(file1Tabs.length === 1, `Expected exactly one tab for ${file1}, got ${file1Tabs.length}`)

  const file2Tabs = group.tabs.filter((tab: any) => tab.uri === file2)
  assert(file2Tabs.length === 1, `Expected exactly one tab for ${file2}, got ${file2Tabs.length}`)

  assert(group.activeTabId === file1Tabs[0].id, 'Expected first URI tab to be active')
}
