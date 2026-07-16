import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-split-up'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/split-up.txt`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Split Up' })
  await expect(menuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 0)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const secondGroup = groups.nth(1)
  const firstGroupTabs = firstGroup.locator('.MainTab')
  const secondGroupTab = secondGroup.locator('.MainTab[title$="split-up.txt"]')
  const groupsContainer = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const sash = Locator('.Main .SashHorizontal')
  await expect(groups).toHaveCount(2)
  await expect(firstGroupTabs).toHaveCount(0)
  await expect(secondGroupTab).toBeVisible()
  await expect(groupsContainer).toHaveCount(1)
  await expect(sash).toHaveCount(1)
}
