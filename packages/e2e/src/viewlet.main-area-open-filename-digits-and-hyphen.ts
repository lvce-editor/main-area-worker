import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-digits-and-hyphen'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/release-2026.ts`
  await FileSystem.writeFile(file, 'export const value = 1')
  await Main.openUri(file)

  const tab = Locator('.MainTab[title$="release-2026.ts"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
