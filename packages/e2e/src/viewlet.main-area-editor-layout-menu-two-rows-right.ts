import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-two-rows-right'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/two-rows-right.txt`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Two Rows Right' })
  await expect(menuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 14)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const firstGroupTab = firstGroup.locator('.MainTab[title$="two-rows-right.txt"]')
  const verticalContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const horizontalContainer = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const verticalSash = Locator('.Main .SashVertical')
  const horizontalSash = Locator('.Main .SashHorizontal')
  await expect(groups).toHaveCount(3)
  await expect(firstGroupTab).toBeVisible()
  await expect(verticalContainer).toHaveCount(1)
  await expect(horizontalContainer).toHaveCount(1)
  await expect(verticalSash).toHaveCount(1)
  await expect(horizontalSash).toHaveCount(1)
}
