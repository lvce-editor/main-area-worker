import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-first-of-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/close-first-three-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)

  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTab[title$="close-first-three-1.ts"]')
  await expect(locator1).toBeHidden()
  const locator2 = Locator('.MainTabSelected[title$="close-first-three-2.ts"]')
  await expect(locator2).toBeVisible()
  const locator3 = Locator('.MainTab')
  await expect(locator3).toHaveCount(2)
}
