import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-switching'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`
  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  const tab1 = Locator('.MainTab[title$="file1.ts"]')

  // act
  await tab1.click()

  // assert
  const selectedTab1 = Locator('.MainTabSelected[title$="file1.ts"]')
  await expect(selectedTab1).toBeVisible()
}
