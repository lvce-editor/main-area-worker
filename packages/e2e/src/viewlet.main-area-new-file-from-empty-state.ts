import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-new-file-from-empty-state'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 108
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.newFile', uid)

  const savedState = await Command.execute('MainArea.saveState', uid)
  const [group] = savedState.layout.groups
  const [tab] = group.tabs

  assert(savedState.layout.groups.length === 1, `Expected 1 group, got ${savedState.layout.groups.length}`)
  assert(group.activeTabId === tab.id, 'Expected new untitled tab to be active')
  assert(tab.title === 'Untitled', `Expected Untitled, got ${tab.title}`)
  assert(tab.isDirty === false, 'Expected new untitled tab to start clean')
}
