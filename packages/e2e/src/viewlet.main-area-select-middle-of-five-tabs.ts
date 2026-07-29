import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-middle-of-five-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/select-five-middle-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }

  await Main.selectTab(0, 2)

  const locator1 = Locator('.MainTabSelected[title$="select-five-middle-3.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(5)
}
