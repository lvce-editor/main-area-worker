import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-split-right'

export const test: Test = async ({ Command, ContextMenu, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const groups = Locator('.EditorGroup')
  await expect(groups).toHaveCount(0)

  const emptyGroup = Locator('.editor-groups-container')
  await expect(emptyGroup).toBeVisible()
  await Command.execute('Main.handleContextMenu', '', 10, 10)
  await new Promise((resolve) => setTimeout(resolve, 50))
  const menuItem = Locator('.MenuItem', { hasText: 'Split Right' })
  await expect(menuItem).toBeVisible()
  await ContextMenu.selectItem('Split Right')

  const groupsContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const sash = Locator('.Main .SashVertical')
  await expect(groups).toHaveCount(2)
  await expect(groupsContainer).toHaveCount(1)
  await expect(sash).toHaveCount(1)
}
