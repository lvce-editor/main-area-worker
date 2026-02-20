import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-toggle-preview-no-files'

export const skip = true

export const test: Test = async ({ expect, Locator, Main }) => {
  // arrange
  await Main.closeAllEditors()
  const noTabs = Locator('.MainTab')
  await expect(noTabs).toHaveCount(0)

  // act
  await Main.handleClickTogglePreview()

  // assert
  const preview = Locator('.Preview')
  await expect(preview).not.toBeVisible()
}
