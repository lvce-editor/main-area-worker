import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save-no-editors'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  // act - open main area without files
  await Main.openUri(tmpDir)

  // assert - verify no tabs exist
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)

  // act - call save when no editors are open
  await Command.execute('Main.save')

  // assert - verify still no tabs exist and no error occurred
  await expect(tabs).toHaveCount(0)
}
