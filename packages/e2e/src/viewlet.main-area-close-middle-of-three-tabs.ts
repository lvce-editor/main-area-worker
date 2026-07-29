import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-middle-of-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/close-middle-three-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }
  await Main.selectTab(0, 1)

  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTab[title$="close-middle-three-2.ts"]')
  await expect(locator1).toBeHidden()
  const locator2 = Locator('.MainTabSelected[title$="close-middle-three-3.ts"]')
  await expect(locator2).toBeVisible()
  const locator3 = Locator('.MainTab')
  await expect(locator3).toHaveCount(2)
}
