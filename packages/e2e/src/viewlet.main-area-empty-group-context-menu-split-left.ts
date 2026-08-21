import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-split-left'

export const test: Test = async ({ ContextMenu, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const groups = Locator('.EditorGroup')
  await expect(groups).toHaveCount(0)

  const emptyGroup = Locator('.editor-groups-container')
  await expect(emptyGroup).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click -- Right-click is the behavior under test and the main-area page object has no mouse-button API.
  await emptyGroup.click({ button: 'right' })
  const menuItem = Locator('.MenuItem', { hasText: 'Split Left' })
  await expect(menuItem).toBeVisible()
  await ContextMenu.selectItem('Split Left')

  const groupsContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const sash = Locator('.Main .SashVertical')
  await expect(groups).toHaveCount(2)
  await expect(groupsContainer).toHaveCount(1)
  await expect(sash).toHaveCount(1)
}
