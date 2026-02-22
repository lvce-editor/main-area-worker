import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-one-item'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 101
  const file1 = `${tmpDir}/open-uris-one-item.ts`

  await FileSystem.writeFile(file1, 'export const one = 1')
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUris', uid, [file1])

  const savedState = await Command.execute('MainArea.saveState', uid)
  const groups = savedState.layout.groups
  assert(groups.length === 1, `Expected 1 group, got ${groups.length}`)

  const [group] = groups
  assert(group.tabs.length === 1, `Expected 1 tab, got ${group.tabs.length}`)
  assert(group.tabs[0].uri === file1, `Expected opened tab uri to be ${file1}, got ${group.tabs[0].uri}`)
  assert(group.activeTabId === group.tabs[0].id, 'Expected opened tab to be active')
}
