import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-horizontal'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')

  await Main.openUri(file1)

  await Main.splitRight()

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(2)
  const editorGroupsContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  await expect(editorGroupsContainer).toHaveCount(1)
}
