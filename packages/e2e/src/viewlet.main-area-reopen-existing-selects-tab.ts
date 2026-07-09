import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reopen-existing-selects-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/reopen-existing-1.ts`
  const file2 = `${tmpDir}/reopen-existing-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file1)

  const locator1 = Locator('.MainTab[title$="reopen-existing-1.ts"]')
  await expect(locator1).toHaveCount(1)
  const locator2 = Locator('.MainTab[title$="reopen-existing-2.ts"]')
  await expect(locator2).toHaveCount(1)
  const locator3 = Locator('.MainTabSelected[title$="reopen-existing-1.ts"]')
  await expect(locator3).toBeVisible()
  const locator4 = Locator('.MainTab')
  await expect(locator4).toHaveCount(2)
}
