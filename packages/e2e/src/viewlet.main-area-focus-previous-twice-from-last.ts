import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-twice-from-last'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/focus-previous-twice-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.focusPrevious()
  await Main.focusPrevious()

  const locator1 = Locator('.MainTabSelected[title$="focus-previous-twice-2.ts"]')
  await expect(locator1).toBeVisible()
}
