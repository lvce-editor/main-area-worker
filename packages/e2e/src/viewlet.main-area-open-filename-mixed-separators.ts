import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-mixed-separators'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/alpha-beta_gamma.ts`
  await FileSystem.writeFile(file, 'export const value = 1')
  await Main.openUri(file)

  const tab = Locator('.MainTab[title$="alpha-beta_gamma.ts"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
