import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-no-tabs'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  // act - open main area without files
  await Main.openUri(tmpDir)

  // assert - verify no tabs exist
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)

  // act - try to close active editor when no tabs are open
  await Main.closeActiveEditor()

  // assert - verify still no tabs (no error occurred)
  await expect(tabs).toHaveCount(0)
}
