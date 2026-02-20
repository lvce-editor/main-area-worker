import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-three-below-each-other'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`

  await FileSystem.writeFile(file1, 'content1')

  await Main.openUri(file1)
  await Command.execute('Main.splitDown')
  await Command.execute('Main.splitDown')

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(3)

  const verticalSashes = Locator('.SashVertical')
  await expect(verticalSashes).toHaveCount(2)

  const horizontalSashes = Locator('.SashHorizontal')
  await expect(horizontalSashes).toHaveCount(0)
}
