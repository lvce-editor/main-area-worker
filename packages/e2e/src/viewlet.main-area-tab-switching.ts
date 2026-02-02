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

  // act - open 3 files
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  // assert - all 3 tabs are visible
  const tab1 = Locator('.MainTab[title$="file1.ts"]')
  const tab2 = Locator('.MainTab[title$="file2.ts"]')
  const tab3 = Locator('.MainTab[title$="file3.ts"]')
  await expect(tab1).toBeVisible()
  await expect(tab2).toBeVisible()
  await expect(tab3).toBeVisible()

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(3)

  // assert - file3 is currently active (last opened)
  const selectedTab3 = Locator('.MainTabSelected[title$="file3.ts"]')
  await expect(selectedTab3).toBeVisible()

  // act - click on first tab to make it active
  await tab1.click()

  // assert - file1 is now active
  const selectedTab1 = Locator('.MainTabSelected[title$="file1.ts"]')
  await expect(selectedTab1).toBeVisible()

  // act - click on second tab to make it active
  await tab2.click()

  // assert - file2 is now active
  const selectedTab2 = Locator('.MainTabSelected[title$="file2.ts"]')
  await expect(selectedTab2).toBeVisible()

  // act - click on third tab to make it active
  await tab3.click()

  // assert - file3 is now active again
  await expect(selectedTab3).toBeVisible()

  // act - open file1 again (should switch to existing tab)
  await Main.openUri(file1)

  // assert - still have 3 tabs
  await expect(tabs).toHaveCount(3)

  // assert - file1 is now active
  await expect(selectedTab1).toBeVisible()
}
