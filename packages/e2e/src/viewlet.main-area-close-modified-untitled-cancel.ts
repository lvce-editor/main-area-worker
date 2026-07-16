import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-modified-untitled-cancel'

export const skip = ['webkit']

export const test: Test = async ({ Command, Editor, expect, Locator, Main }) => {
  await Command.execute('Main.newFile')

  const untitledTab = Locator('.MainTab[title^="untitled:///"]')
  await expect(untitledTab).toHaveClass('MainTabSelected')

  await Editor.shouldHaveText('')
  await Editor.setCursor(0, 0)
  await Editor.type('unsaved content')
  await Editor.shouldHaveText('unsaved content')
  await expect(untitledTab).toHaveClass('MainTabModified')

  await Main.closeActiveEditor()

  await expect(untitledTab).toBeVisible()
  await Editor.shouldHaveText('unsaved content')
}
