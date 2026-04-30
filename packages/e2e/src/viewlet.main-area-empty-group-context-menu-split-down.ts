import type { Test } from '@lvce-editor/test-with-playwright'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const name = 'viewlet.main-area-empty-group-context-menu-split-down'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const beforeState = await Main.saveState(2)
  assert(beforeState.layout.groups.length === 0, `Expected no groups, got ${beforeState.layout.groups.length}`)

  await Command.execute('Main.handleContextMenu', '', 10, 10)

  const splitDownMenuItem = Locator('text=Split Down')
  await expect(splitDownMenuItem).toBeVisible()
  await splitDownMenuItem.click()

  const afterState = await Main.saveState(2)
  assert(afterState.layout.direction === 2, `Expected vertical layout, got ${afterState.layout.direction}`)
  assert(afterState.layout.groups.length === 2, `Expected 2 groups, got ${afterState.layout.groups.length}`)
  assert(afterState.layout.groups[0].id !== afterState.layout.groups[1].id, 'Expected distinct groups after split down')
  assert(afterState.layout.activeGroupId === afterState.layout.groups[1].id, 'Expected new lower group to become active')
}
