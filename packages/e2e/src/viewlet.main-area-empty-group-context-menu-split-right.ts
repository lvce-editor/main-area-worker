import type { Test } from '@lvce-editor/test-with-playwright'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const name = 'viewlet.main-area-empty-group-context-menu-split-right'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 103

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  const beforeState = await Command.execute('MainArea.saveState', uid)
  const sourceGroupId = beforeState.layout.groups[0].id

  await Command.execute('MainArea.handleContextMenu', uid, String(sourceGroupId), 10, 10)

  const splitRightMenuItem = Locator('text=Split Right')
  await expect(splitRightMenuItem).toBeVisible()
  await splitRightMenuItem.click()

  const afterState = await Command.execute('MainArea.saveState', uid)
  assert(afterState.layout.direction === 'horizontal', `Expected horizontal layout, got ${afterState.layout.direction}`)
  assert(afterState.layout.groups.length === 2, `Expected 2 groups, got ${afterState.layout.groups.length}`)
  assert(afterState.layout.groups[0].id === sourceGroupId, `Expected source group ${sourceGroupId} to remain at index 0`)
  assert(afterState.layout.groups[1].id !== sourceGroupId, 'Expected new group to be created to the right')
  assert(afterState.layout.activeGroupId === afterState.layout.groups[1].id, 'Expected new right group to become active')
}
