import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-empty-group'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Main.splitRight()

  // assert
  const editorGroups = Locator('.EditorGroup')
  const focusableEditorGroups = Locator('.EditorGroup[tabindex="0"]')
  await expect(editorGroups).toHaveCount(2)
  await expect(focusableEditorGroups).toHaveCount(2)
}
