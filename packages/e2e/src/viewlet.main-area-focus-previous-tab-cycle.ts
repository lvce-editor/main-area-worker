import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-tab-cycle'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange - create test files
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.txt`
  const file2 = `${tmpDir}/file2.txt`
  const file3 = `${tmpDir}/file3.txt`
  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')

  // arrange - open files
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  // arrange - verify all tabs are visible and third tab is active
  const tab1 = Locator('.MainTab[title$="file1.txt"]')
  const tab3 = Locator('.MainTab[title$="file3.txt"]')
  await expect(tab1).toBeVisible()
  await expect(tab3).toBeVisible()
  const selectedTab1 = Locator('.MainTabSelected[title$="file1.txt"]')
  const selectedTab3 = Locator('.MainTabSelected[title$="file3.txt"]')
  await expect(selectedTab3).toBeVisible()

  // act - focus previous tab twice to reach first tab
  await Main.focusPrevious()
  await Main.focusPrevious()

  // assert - verify first tab is now selected
  await expect(selectedTab1).toBeVisible()

  // act - focus previous tab while at first tab (should cycle to last)
  await Main.focusPrevious()

  // assert - verify third tab is now selected (cyclic behavior)
  await expect(selectedTab3).toBeVisible()
}
