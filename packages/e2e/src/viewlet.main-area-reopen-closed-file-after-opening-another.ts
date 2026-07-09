import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reopen-closed-file-after-opening-another'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/reopen-after-other-1.ts`
  const file2 = `${tmpDir}/reopen-after-other-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.closeActiveEditor()
  await Main.openUri(file2)

  const tab1 = Locator('.MainTab[title$="reopen-after-other-1.ts"]')
  await expect(tab1).toBeVisible()
  const tab2 = Locator('.MainTab[title$="reopen-after-other-2.ts"]')
  await expect(tab2).toBeVisible()
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
}
