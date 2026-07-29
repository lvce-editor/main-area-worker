import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-first-of-two-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [`${tmpDir}/select-two-1.ts`, `${tmpDir}/select-two-2.ts`]
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.selectTab(0, 0)

  const locator1 = Locator('.MainTabSelected[title$="select-two-1.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(2)
}
