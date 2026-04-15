import type { Test } from '@lvce-editor/test-with-playwright'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const name = 'viewlet.main-area-empty-group-context-menu-split-left'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 104

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  const beforeState = await Command.execute('MainArea.saveState', uid)
  const sourceGroupId = beforeState.layout.groups[0].id

  await Command.execute('MainArea.handleContextMenu', uid, String(sourceGroupId), 10, 10)

  const splitLeftMenuItem = Locator('text=Split Left')
  await expect(splitLeftMenuItem).toBeVisible()
  await splitLeftMenuItem.click()

  const afterState = await Command.execute('MainArea.saveState', uid)
  assert(afterState.layout.direction === 'horizontal', `Expected horizontal layout, got ${afterState.layout.direction}`)
  assert(afterState.layout.groups.length === 2, `Expected 2 groups, got ${afterState.layout.groups.length}`)
  assert(afterState.layout.groups[1].id === sourceGroupId, `Expected source group ${sourceGroupId} to move to index 1`)
  assert(afterState.layout.groups[0].id !== sourceGroupId, 'Expected new group to be inserted to the left')
  assert(afterState.layout.activeGroupId === afterState.layout.groups[0].id, 'Expected new left group to become active')
}
