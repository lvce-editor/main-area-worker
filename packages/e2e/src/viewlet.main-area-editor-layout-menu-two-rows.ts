import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-two-rows'
export const skip = ['webkit'] as const

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/two-rows.txt`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  const editorLayoutMenuItem = Locator('#Menu-0 .MenuItem', { hasText: 'Editor Layout' })
  await expect(editorLayoutMenuItem).toBeVisible()
  await editorLayoutMenuItem.dispatchEvent('click', clickEventInit)
  const matchingMenuItems = Locator('#Menu-1 .MenuItem', { hasText: 'Two Rows' })
  const menuItem = matchingMenuItems.nth(0)
  await expect(menuItem).toBeVisible()
  await menuItem.dispatchEvent('click', clickEventInit)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const secondGroup = groups.nth(1)
  const firstGroupTab = firstGroup.locator('.MainTab[title$="two-rows.txt"]')
  const groupsContainer = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const sash = Locator('.Main .SashHorizontal')
  await expect(groups).toHaveCount(2)
  await expect(firstGroup).toHaveAttribute('style', 'height: 50%;')
  await expect(firstGroupTab).toBeVisible()
  await expect(secondGroup).toHaveAttribute('style', 'height: 50%;')
  await expect(groupsContainer).toHaveCount(1)
  await expect(sash).toHaveCount(1)
}
