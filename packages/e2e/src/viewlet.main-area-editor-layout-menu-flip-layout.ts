import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-flip-layout'
export const skip = ['webkit'] as const

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/flip-layout.txt`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)
  await Main.splitRight()
  const second = `${tmpDir}/flip-layout-second.txt`
  await FileSystem.writeFile(second, 'second editor')
  await Main.openUri(second)
  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(2)

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  const editorLayoutMenuItem = Locator('#Menu-0 .MenuItem', { hasText: 'Editor Layout' })
  await expect(editorLayoutMenuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Flip Layout' })
  await expect(menuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 17)

  const group = Locator('.EditorGroup')
  const tab = group.locator('.MainTab[title$="flip-layout.txt"]')
  await expect(group).toHaveCount(2)
  const firstGroup = group.nth(0)
  await expect(firstGroup).toHaveAttribute('style', 'width: 100%; height: 50%;')
  const secondGroup = group.nth(1)
  await expect(secondGroup).toHaveAttribute('style', 'width: 100%; height: 50%;')
  const secondTab = group.nth(1).locator('.MainTab[title$="flip-layout-second.txt"]')
  await expect(secondTab).toBeVisible()
  await expect(tab).toBeVisible()
}
