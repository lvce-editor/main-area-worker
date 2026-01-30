import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-no-editors'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  // act - open main area without files
  await Main.openUri(tmpDir)

  // assert - verify no tabs exist
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
}
