import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-first-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-first-1.ts`
  const file2 = `${tmpDir}/close-first-2.ts`
  const file3 = `${tmpDir}/close-first-3.ts`

  await FileSystem.writeFile(file1, 'export const one = 1')
  await FileSystem.writeFile(file2, 'export const two = 2')
  await FileSystem.writeFile(file3, 'export const three = 3')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  await Main.selectTab(0, 0)
  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTab[title$="close-first-1.ts"]')
  await expect(locator1).toBeHidden()
  const locator2 = Locator('.MainTab[title$="close-first-2.ts"]')
  await expect(locator2).toBeVisible()
  const locator3 = Locator('.MainTab[title$="close-first-3.ts"]')
  await expect(locator3).toBeVisible()
  const locator4 = Locator('.MainTab')
  await expect(locator4).toHaveCount(2)
}
