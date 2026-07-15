import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-selects-neighbor'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-neighbor-1.ts`
  const file2 = `${tmpDir}/close-neighbor-2.ts`

  await FileSystem.setFiles([
    { content: 'one', uri: file1 },
    { content: 'two', uri: file2 },
  ])

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTab[title$="close-neighbor-2.ts"]')
  await expect(locator1).toBeHidden()
  const locator2 = Locator('.MainTabSelected[title$="close-neighbor-1.ts"]')
  await expect(locator2).toBeVisible()
  const locator3 = Locator('.MainTab')
  await expect(locator3).toHaveCount(1)
}
