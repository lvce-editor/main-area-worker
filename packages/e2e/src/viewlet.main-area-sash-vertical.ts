import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-sash-vertical'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`

  await FileSystem.setFiles([
    { content: 'content1', uri: file1 },
    { content: 'content2', uri: file2 },
  ])

  await Main.openUri(file1)
  await Main.splitDown()

  const sash = Locator('.SashHorizontal')
  await expect(sash).toBeVisible()
  await expect(sash).toHaveCount(1)
}
