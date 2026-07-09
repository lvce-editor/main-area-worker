import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-after-reopen'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file = `${tmpDir}/close-all-reopen.ts`

  await FileSystem.writeFile(file, 'export const value = 1')

  await Main.openUri(file)
  await Main.closeAllEditors()
  await Main.openUri(file)

  const locator1 = Locator('.MainTab[title$="close-all-reopen.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(1)
}
