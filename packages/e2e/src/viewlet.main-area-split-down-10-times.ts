import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-down-10-times'

const splitCount = 10

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/file1.ts`

  await FileSystem.writeFile(file1, 'content1')

  await Main.openUri(file1)

  for (let i = 0; i < splitCount; i++) {
    await Command.execute('Main.splitDown')
  }

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(splitCount + 1)
}
