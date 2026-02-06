import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-toggle-preview-no-files'

export const test: Test = async ({ expect, Locator, Main, Command }) => {
  // arrange
  await Command.execute('Main.closeAll')
  const noTabs = Locator('.MainTab')
  await expect(noTabs).toHaveCount(0)

  // act
  await Command.execute('Main.handleClickTogglePreview')

  // assert
  const preview = Locator('.Preview')
  await expect(preview).not.toBeVisible()
}
