import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-two-items'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 102
  const file1 = `${tmpDir}/open-uris-two-items-1.ts`
  const file2 = `${tmpDir}/open-uris-two-items-2.ts`

  await FileSystem.writeFile(file1, 'export const first = 1')
  await FileSystem.writeFile(file2, 'export const second = 2')

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUris', uid, [file1, file2])

  const savedState = await Command.execute('MainArea.saveState', uid)
  const groups = savedState.layout.groups
  assert(groups.length === 1, `Expected 1 group, got ${groups.length}`)

  const [group] = groups
  assert(group.tabs.length === 2, `Expected 2 tabs, got ${group.tabs.length}`)
  assert(group.tabs[0].uri === file1, `Expected first tab uri ${file1}, got ${group.tabs[0].uri}`)
  assert(group.tabs[1].uri === file2, `Expected second tab uri ${file2}, got ${group.tabs[1].uri}`)
  assert(group.activeTabId === group.tabs[0].id, 'Expected first URI tab to remain active')
}
