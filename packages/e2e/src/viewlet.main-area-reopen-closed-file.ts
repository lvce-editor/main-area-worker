import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reopen-closed-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file = `${tmpDir}/reopen-closed.ts`

  await FileSystem.writeFile(file, 'export const reopened = true')
  await Main.openUri(file)
  await Main.closeActiveEditor()
  await Main.openUri(file)

  const locator1 = Locator('.MainTab[title$="reopen-closed.ts"]')
  await expect(locator1).toHaveCount(1)
  const locator2 = Locator('.MainTabSelected[title$="reopen-closed.ts"]')
  await expect(locator2).toBeVisible()
}
