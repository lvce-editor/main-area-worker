import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-grid'
export const skip = ['webkit'] as const

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/grid.txt`
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
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Grid (2x2)' })
  await expect(menuItem).toBeVisible()
  await menuItem.dispatchEvent('click', clickEventInit)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const firstGroupTab = firstGroup.locator('.MainTab[title$="grid.txt"]')
  const verticalContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const horizontalContainers = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const verticalSash = Locator('.Main .SashVertical')
  const horizontalSashes = Locator('.Main .SashHorizontal')
  await expect(groups).toHaveCount(4)
  await expect(firstGroupTab).toBeVisible()
  await expect(verticalContainer).toHaveCount(1)
  await expect(horizontalContainers).toHaveCount(2)
  await expect(verticalSash).toHaveCount(1)
  await expect(horizontalSashes).toHaveCount(2)
}
