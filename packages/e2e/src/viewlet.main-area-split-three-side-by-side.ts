import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-three-side-by-side'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/file1.ts`

  await FileSystem.writeFile(file1, 'content1')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.splitRight()

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(3)

  const horizontalSashes = Locator('.Main .SashHorizontal')
  await expect(horizontalSashes).toHaveCount(0)

  const verticalSashes = Locator('.Main .SashVertical')
  await expect(verticalSashes).toHaveCount(2)
}
