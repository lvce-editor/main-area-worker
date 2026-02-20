import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-no-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Main.closeActiveEditor()

  // assert - verify no tabs exist
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
}
