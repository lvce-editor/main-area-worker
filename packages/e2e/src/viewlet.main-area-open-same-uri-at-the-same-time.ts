import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-same-uri-at-the-same-time'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const testFile = `${tmpDir}/same-file.txt`
  await FileSystem.writeFile(testFile, 'content')

  await Promise.all([Main.openUri(testFile), Main.openUri(testFile)])

  const tabs = Locator('.MainTab')
  const tab = Locator('.MainTab[title$="same-file.txt"]')
  await expect(tabs).toHaveCount(1)
  await expect(tab).toBeVisible()
}
