import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-up-close-lower-group'
export const skip = ['webkit'] as const

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, TitleBarMenuBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  const editorLayoutMenuItem = Locator('#Menu-0 .MenuItem', { hasText: 'Editor Layout' })
  await expect(editorLayoutMenuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)
  const splitUpMenuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Split Up' })
  await expect(splitUpMenuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 0)

  const editorGroups = Locator('.EditorGroup')
  const closeButtons = Locator('.EmptyGroupCloseButton')
  const mainTabs = Locator('.MainTab')
  const lowerGroupCloseButton = editorGroups.nth(1).locator('.EmptyGroupCloseButton')
  await expect(editorGroups).toHaveCount(2)
  await expect(closeButtons).toHaveCount(2)
  await lowerGroupCloseButton.dispatchEvent('click', clickEventInit)
  await Main.handleClickAction('', '')

  await expect(editorGroups).toHaveCount(1)
  await expect(mainTabs).toHaveCount(0)
  await expect(closeButtons).toHaveCount(0)
}
