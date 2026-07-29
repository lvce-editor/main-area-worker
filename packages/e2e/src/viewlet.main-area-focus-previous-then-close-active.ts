import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-then-close-active'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/focus-previous-close-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }
  await Main.selectTab(0, 3)

  await Main.focusPrevious()
  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTab[title$="focus-previous-close-3.ts"]')
  await expect(locator1).toBeHidden()
  const locator2 = Locator('.MainTabSelected[title$="focus-previous-close-4.ts"]')
  await expect(locator2).toBeVisible()
  const locator3 = Locator('.MainTab')
  await expect(locator3).toHaveCount(4)
}
