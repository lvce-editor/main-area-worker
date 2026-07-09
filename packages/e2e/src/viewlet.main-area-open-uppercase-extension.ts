import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uppercase-extension'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file = `${tmpDir}/README.MD`

  await FileSystem.writeFile(file, '# title')
  await Main.openUri(file)

  const locator1 = Locator('.MainTab[title$="README.MD"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTabSelected[title$="README.MD"]')
  await expect(locator2).toBeVisible()
}
