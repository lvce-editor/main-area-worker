import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-switching'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.txt`
  const file2 = `${tmpDir}/file2.txt`
  const file3 = `${tmpDir}/file3.txt`
  await FileSystem.setFiles([
    { content: 'content1', uri: file1 },
    { content: 'content2', uri: file2 },
    { content: 'content3', uri: file3 },
  ])
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  // act
  await Main.selectTab(0, 0)

  // assert
  const selectedTab1 = Locator('.MainTabSelected[title$="file1.txt"]')
  await expect(selectedTab1).toBeVisible()
}
