import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-folder'
export const skip = 1

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const folderPath = `${tmpDir}/folder-to-open`
  const uid = 101

  await FileSystem.mkdir(folderPath)
  await Workspace.setPath(tmpDir)
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, {
    focu: false,
    preview: false,
    uri: folderPath,
  })

  const savedState = await Command.execute('MainArea.saveState', uid)
  const { groups } = savedState.layout
  assert(groups.length === 1, `Expected 1 group, got ${groups.length}`)

  const [group] = groups
  assert(group.tabs.length === 1, `Expected 1 tab, got ${group.tabs.length}`)

  const [tab] = group.tabs
  assert(tab.loadingState === 'error', `Expected loadingState to be error, got ${tab.loadingState}`)
  assert(tab.errorMessage === 'Expected a file but received a folder', `Expected folder error message, got ${tab.errorMessage}`)
  assert(group.activeTabId === tab.id, 'Expected folder tab to be active')
}
