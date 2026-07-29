import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-single-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/focus-next-single.ts`
  await FileSystem.writeFile(file, 'export const value = true')
  await Main.openUri(file)

  await Main.focusNext()

  const locator1 = Locator('.MainTabSelected[title$="focus-next-single.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(1)
}
