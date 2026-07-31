import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-jest-config'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/jest.config.cjs`
  await FileSystem.writeFile(file, 'module.exports = {}')
  await Main.openUri(file)
  const tab = Locator('.MainTab[title$="jest.config.cjs"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
