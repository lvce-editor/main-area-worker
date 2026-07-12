import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-down-open-file-in-new-group'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/split-down-new-group-1.ts`
  const file2 = `${tmpDir}/split-down-new-group-2.ts`

  await FileSystem.setFiles([
    { content: 'one', uri: file1 },
    { content: 'two', uri: file2 },
  ])

  await Main.openUri(file1)
  await Main.splitDown()
  await Main.openUri(file2)

  const locator1 = Locator('.MainTab[title$="split-down-new-group-1.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab[title$="split-down-new-group-2.ts"]')
  await expect(locator2).toBeVisible()
  const locator3 = Locator('.MainTabSelected[title$="split-down-new-group-2.ts"]')
  await expect(locator3).toBeVisible()
  const locator4 = Locator('.EditorGroup')
  await expect(locator4).toHaveCount(2)
}
