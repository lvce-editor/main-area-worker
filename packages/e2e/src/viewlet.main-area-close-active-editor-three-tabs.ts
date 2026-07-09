import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-three-1.ts`
  const file2 = `${tmpDir}/close-three-2.ts`
  const file3 = `${tmpDir}/close-three-3.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
  await FileSystem.writeFile(file3, 'three')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  await Main.closeActiveEditor()

  const tab1 = Locator('.MainTab[title$="close-three-1.ts"]')
  await expect(tab1).toBeVisible()
  const tab2 = Locator('.MainTab[title$="close-three-2.ts"]')
  await expect(tab2).toBeVisible()
  const tab3 = Locator('.MainTab[title$="close-three-3.ts"]')
  await expect(tab3).toBeHidden()
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
}
