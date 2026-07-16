import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-three-rows'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/three-rows.txt`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Three Rows' })
  await expect(menuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 12)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const firstGroupTab = firstGroup.locator('.MainTab[title$="three-rows.txt"]')
  const groupsContainer = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const sashes = Locator('.Main .SashHorizontal')
  await expect(groups).toHaveCount(3)
  await expect(firstGroupTab).toBeVisible()
  await expect(groupsContainer).toHaveCount(1)
  await expect(sashes).toHaveCount(2)
}
