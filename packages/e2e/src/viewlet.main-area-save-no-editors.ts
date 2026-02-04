import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save-no-editors'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Main.save()

  // assert
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
}
