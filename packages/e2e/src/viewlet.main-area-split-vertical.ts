import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-vertical'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')

  await Main.openUri(file1)

  await Command.execute('Main.splitDown')

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(2)
  const editorGroupsContainer = Locator('.editor-groups-container.EditorGroupsHorizontal')
  await expect(editorGroupsContainer).toHaveCount(1)
}
