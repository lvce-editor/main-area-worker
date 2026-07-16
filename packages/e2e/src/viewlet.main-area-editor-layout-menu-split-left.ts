import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-split-left'
export const skip = ['webkit'] as const

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/split-left.txt`
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
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Split Left' })
  await expect(menuItem).toBeVisible()
  await menuItem.dispatchEvent('click', clickEventInit)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const secondGroup = groups.nth(1)
  const firstGroupTabs = firstGroup.locator('.MainTab')
  const secondGroupTab = secondGroup.locator('.MainTab[title$="split-left.txt"]')
  const groupsContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const sash = Locator('.Main .SashVertical')
  await expect(groups).toHaveCount(2)
  await expect(firstGroupTabs).toHaveCount(0)
  await expect(secondGroupTab).toBeVisible()
  await expect(groupsContainer).toHaveCount(1)
  await expect(sash).toHaveCount(1)
}
