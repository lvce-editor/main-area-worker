import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-then-close-active'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/focus-next-close-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }
  await Main.selectTab(0, 1)

  await Main.focusNext()
  await Main.closeActiveEditor()

  const locator1 = Locator('.MainTab[title$="focus-next-close-3.ts"]')
  await expect(locator1).toBeHidden()
  const locator2 = Locator('.MainTabSelected[title$="focus-next-close-4.ts"]')
  await expect(locator2).toBeVisible()
  const locator3 = Locator('.MainTab')
  await expect(locator3).toHaveCount(4)
}
