import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-two-columns-bottom'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/two-columns-bottom.txt`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Two Columns Bottom' })
  await expect(menuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 15)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const firstGroupTab = firstGroup.locator('.MainTab[title$="two-columns-bottom.txt"]')
  const horizontalContainer = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const verticalContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const horizontalSash = Locator('.Main .SashHorizontal')
  const verticalSash = Locator('.Main .SashVertical')
  await expect(groups).toHaveCount(3)
  await expect(firstGroupTab).toBeVisible()
  await expect(horizontalContainer).toHaveCount(1)
  await expect(verticalContainer).toHaveCount(1)
  await expect(horizontalSash).toHaveCount(1)
  await expect(verticalSash).toHaveCount(1)
}
