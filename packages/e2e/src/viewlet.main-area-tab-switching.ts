import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-switching'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.txt`
  const file2 = `${tmpDir}/file2.txt`
  const file3 = `${tmpDir}/file3.txt`
  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  // act
  await Command.execute('Main.selectTab', 0, 0)

  // assert
  const selectedTab1 = Locator('.MainTabSelected[title$="file1.txt"]')
  await expect(selectedTab1).toBeVisible()
}
