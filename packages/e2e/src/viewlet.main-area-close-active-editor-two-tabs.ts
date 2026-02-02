import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-two-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile1 = `${tmpDir}/test1.ts`
  const testFile2 = `${tmpDir}/test2.ts`
  const testContent1 = 'export const hello = () => "world"'
  const testContent2 = 'export const goodbye = () => "world"'
  await FileSystem.writeFile(testFile1, testContent1)
  await FileSystem.writeFile(testFile2, testContent2)

  // act - open first file
  await Main.openUri(testFile1)

  // assert - verify first tab is visible
  const tab1 = Locator('.MainTab[title$="test1.ts"]')
  await expect(tab1).toBeVisible()

  // act - open second file
  await Main.openUri(testFile2)

  // assert - verify both tabs are visible
  const tab2 = Locator('.MainTab[title$="test2.ts"]')
  await expect(tab1).toBeVisible()
  await expect(tab2).toBeVisible()

  // assert - verify we have 2 tabs
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)

  // act - close active editor (should close test2.ts)
  await Main.closeActiveEditor()

  // assert - verify second tab is closed
  await expect(tab2).toBeHidden()

  // assert - verify first tab still exists
  await expect(tab1).toBeVisible()

  // assert - verify only 1 tab remains
  await expect(tabs).toHaveCount(1)
}
