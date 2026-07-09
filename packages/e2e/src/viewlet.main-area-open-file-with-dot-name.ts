import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-with-dot-name'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file = `${tmpDir}/config.test.env`

  await FileSystem.writeFile(file, 'VALUE=1')
  await Main.openUri(file)

  const locator1 = Locator('.MainTab[title$="config.test.env"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTabSelected[title$="config.test.env"]')
  await expect(locator2).toBeVisible()
}
