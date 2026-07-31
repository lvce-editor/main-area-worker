import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-browser-suffix'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/index.browser.ts`
  await FileSystem.writeFile(file, 'export const value = 1')
  await Main.openUri(file)
  const tab = Locator('.MainTab[title$="index.browser.ts"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
