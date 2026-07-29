import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-first-twice-of-four-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/close-first-twice-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }
  await Main.selectTab(0, 0)

  await Main.closeActiveEditor()
  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTabSelected[title$="close-first-twice-3.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(2)
}
