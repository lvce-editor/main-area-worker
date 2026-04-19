import type { Test } from '@lvce-editor/test-with-playwright'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const name = 'viewlet.main-area-empty-group-context-menu-close-group'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 107

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  const initialState = await Command.execute('MainArea.saveState', uid)
  const initialGroupId = initialState.layout.groups[0].id

  await Command.execute('MainArea.splitRight', uid, initialGroupId)

  const beforeState = await Command.execute('MainArea.saveState', uid)
  const sourceGroupId = beforeState.layout.groups[1].id

  await Command.execute('MainArea.handleContextMenu', uid, String(sourceGroupId), 10, 10)

  const closeGroupMenuItem = Locator('text=Close Editor Group')
  await expect(closeGroupMenuItem).toBeVisible()
  await closeGroupMenuItem.click()

  const afterState = await Command.execute('MainArea.saveState', uid)
  assert(afterState.layout.groups.length === 1, `Expected 1 group, got ${afterState.layout.groups.length}`)
  assert(afterState.layout.groups[0].id !== sourceGroupId, `Expected group ${sourceGroupId} to be removed`)
}
