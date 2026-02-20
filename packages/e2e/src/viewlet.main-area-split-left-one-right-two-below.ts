import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-left-one-right-two-below'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`

  await FileSystem.writeFile(file1, 'content1')

  await Main.openUri(file1)
  await Main.splitRight()

  // focus right group, then split it vertically
  await Command.execute('Main.selectTab', 1, 0)
  await Command.execute('Main.splitDown')

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(3)

  const horizontalSashes = Locator('.SashHorizontal')
  await expect(horizontalSashes).toHaveCount(1)

  const verticalSashes = Locator('.SashVertical')
  await expect(verticalSashes).toHaveCount(1)
}
