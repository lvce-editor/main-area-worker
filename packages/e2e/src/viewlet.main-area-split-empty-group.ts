import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-empty-group'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Main.splitRight()

  // assert
  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(2)
}
