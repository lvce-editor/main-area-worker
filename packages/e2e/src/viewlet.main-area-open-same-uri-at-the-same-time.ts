import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-same-uri-at-the-same-time'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const testFile = `${tmpDir}/same-file.txt`
  await FileSystem.writeFile(testFile, 'content')

  // act
  await Promise.all([Main.openUri(testFile), Main.openUri(testFile)])

  // assert
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
  const tab = Locator('.MainTab[title$="same-file.txt"]')
  await expect(tab).toBeVisible()
}
