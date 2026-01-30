import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-single-tab'

export const skip = 1

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

  await Main.closeAllEditors()

  // assert - verify no tabs remain
  await expect(tab).not.toBeVisible()
}
