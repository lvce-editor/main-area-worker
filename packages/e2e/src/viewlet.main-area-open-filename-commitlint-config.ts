import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-commitlint-config'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/commitlint.config.js`
  await FileSystem.writeFile(file, 'export default {}')
  await Main.openUri(file)
  const tab = Locator('.MainTab[title$="commitlint.config.js"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
