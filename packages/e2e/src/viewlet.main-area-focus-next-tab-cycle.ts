import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-tab-cycle'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
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
  const selectedTab3 = Locator('.MainTabSelected[title$="file3.txt"]')
  await expect(selectedTab3).toBeVisible()

  // act - focus next tab while at last tab (should cycle to first)
  await Command.execute('Main.focusNextTab', 0)

  // assert - verify first tab is now selected (cyclic behavior)
  const selectedTab1 = Locator('.MainTabSelected[title$="file1.txt"]')
  await expect(selectedTab1).toBeVisible()
}
