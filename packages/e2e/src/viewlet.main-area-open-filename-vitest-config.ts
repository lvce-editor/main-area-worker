import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-vitest-config'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/vitest.config.ts`
  await FileSystem.writeFile(file, 'export default {}')
  await Main.openUri(file)
  const tab = Locator('.MainTab[title$="vitest.config.ts"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
