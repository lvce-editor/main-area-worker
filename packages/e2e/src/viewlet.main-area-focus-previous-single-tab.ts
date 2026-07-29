import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-single-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/focus-previous-single.ts`
  await FileSystem.writeFile(file, 'export const value = true')
  await Main.openUri(file)

  await Main.focusPrevious()

  const locator1 = Locator('.MainTabSelected[title$="focus-previous-single.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(1)
}
