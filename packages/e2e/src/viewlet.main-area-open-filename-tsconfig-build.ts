import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-tsconfig-build'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/tsconfig.build.json`
  await FileSystem.writeFile(file, '{}')
  await Main.openUri(file)
  const tab = Locator('.MainTab[title$="tsconfig.build.json"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
