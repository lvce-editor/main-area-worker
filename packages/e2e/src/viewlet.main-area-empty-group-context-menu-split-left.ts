import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-split-left'

export const test: Test = async ({ Command, ContextMenu, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const groups = Locator('.EditorGroup')
  await expect(groups).toHaveCount(0)

  await Command.execute('Main.handleContextMenu', '', 10, 10)
  await new Promise((resolve) => setTimeout(resolve, 100))
  const menuItem = Locator('.MenuItem', { hasText: 'Split Left' })
  await expect(menuItem).toBeVisible()
  await ContextMenu.selectItem('Split Left')

  const groupsContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const sash = Locator('.Main .SashVertical')
  await expect(groups).toHaveCount(2)
  await expect(groupsContainer).toHaveCount(1)
  await expect(sash).toHaveCount(1)
}
