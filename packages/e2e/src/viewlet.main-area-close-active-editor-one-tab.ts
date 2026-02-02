import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-one-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  // act - open file
  await Main.openUri(testFile)

  // assert - verify tab is visible
  const tab = Locator('.MainTab[title$="test.ts"]')
  await expect(tab).toBeVisible()

  // act - close active editor
  await Main.closeActiveEditor()

  // assert - verify tab is closed
  await expect(tab).toBeHidden()

  // assert - verify no tabs remain
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
}
