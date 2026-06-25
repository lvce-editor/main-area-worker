import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-header-double-click-new-file'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 109
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/header-existing.ts`

  await FileSystem.writeFile(file1, 'existing')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)
  await Command.execute('MainArea.handleHeaderDoubleClick', uid, 'MainTabs', '0')

  const savedState = await Command.execute('MainArea.saveState', uid)
  const tabs = savedState.layout.groups[0].tabs

  assert(tabs.length === 2, `Expected 2 tabs, got ${tabs.length}`)
  assert(tabs[1].title === 'Untitled', `Expected Untitled, got ${tabs[1].title}`)
  assert(savedState.layout.groups[0].activeTabId === tabs[1].id, 'Expected created tab to be active')
}
