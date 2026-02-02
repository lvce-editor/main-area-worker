import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-no-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/a.txt`
  await FileSystem.writeFile(testFile, '')

  // act - open file then close it to have no tabs
  await Main.openUri(testFile)
  await Main.closeActiveEditor()

  // assert - verify no tabs exist
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)

  // act - try to close active editor when no tabs are open
  await Main.closeActiveEditor()

  // assert - verify still no tabs (no error occurred)
  await expect(tabs).toHaveCount(0)
}
