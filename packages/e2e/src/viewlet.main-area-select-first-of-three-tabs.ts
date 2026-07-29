import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-first-of-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/select-three-first-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.selectTab(0, 0)

  const locator1 = Locator('.MainTabSelected[title$="select-three-first-1.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(3)
}
