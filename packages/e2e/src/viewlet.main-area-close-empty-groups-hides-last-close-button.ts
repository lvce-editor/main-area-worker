import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-empty-groups-hides-last-close-button'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Main.splitRight()
  await Main.splitRight()

  const editorGroups = Locator('.EditorGroup')
  const closeButtons = Locator('.EmptyGroupCloseButton')
  await expect(editorGroups).toHaveCount(3)
  await expect(closeButtons).toHaveCount(3)

  await Command.execute('MainArea.closeEditorGroup', 1)
  await expect(editorGroups).toHaveCount(2)
  await expect(closeButtons).toHaveCount(2)
  await Command.execute('MainArea.closeEditorGroup', 2)

  await expect(editorGroups).toHaveCount(1)
  await expect(closeButtons).toHaveCount(0)
}
