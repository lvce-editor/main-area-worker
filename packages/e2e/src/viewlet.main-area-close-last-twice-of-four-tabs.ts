import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-last-twice-of-four-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/close-last-twice-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.closeActiveEditor()
  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTabSelected[title$="close-last-twice-2.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(2)
}
