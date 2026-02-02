import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-multiple-tabs-at-the-same-time'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.txt`
  const file2 = `${tmpDir}/file2.txt`
  const file3 = `${tmpDir}/file3.txt`
  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')

  // act
  await Promise.all([Main.openUri(file1), Main.openUri(file2), Main.openUri(file3)])

  // assert
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(3)
}
