import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-modified-untitled-cancel'

export const test: Test = async ({ Command, Editor, expect, Locator, Main, TitleBarMenuBar }) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowDown()

  const newFileMenuItem = Locator('.MenuItem', { hasText: 'New File' })
  await expect(newFileMenuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 0, 0)

  const untitledTab = Locator('.MainTab[title^="untitled:///"]')
  await expect(untitledTab).toHaveClass('MainTabSelected')

  await Editor.shouldHaveText('')
  await Editor.setCursor(0, 0)
  await Editor.type('unsaved content')
  await Editor.shouldHaveText('unsaved content')

  await Main.closeActiveEditor()

  await expect(untitledTab).toBeVisible()
  await Editor.shouldHaveText('unsaved content')
}
