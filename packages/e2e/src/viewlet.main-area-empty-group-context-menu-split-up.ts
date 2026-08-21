import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-split-up'
export const skip = ['webkit'] as const

export const test: Test = async ({ Command, ContextMenu, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const groups = Locator('.EditorGroup')
  await expect(groups).toHaveCount(0)

  await Command.execute('Main.handleContextMenu', '', 10, 10)
  await new Promise((resolve) => setTimeout(resolve, 500))
  const menuItem = Locator('.MenuItem', { hasText: 'Split Up' })
  await expect(menuItem).toBeVisible()
  await ContextMenu.selectItem('Split Up')

  const groupsContainer = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const sash = Locator('.Main .SashHorizontal')
  await expect(groups).toHaveCount(2)
  await expect(groupsContainer).toHaveCount(1)
  await expect(sash).toHaveCount(1)
}
