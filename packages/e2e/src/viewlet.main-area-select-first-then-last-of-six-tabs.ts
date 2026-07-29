import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-first-then-last-of-six-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 6 }, (_, index) => `${tmpDir}/select-first-last-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.selectTab(0, 0)
  await Main.selectTab(0, 5)

  const selectedTab = Locator('.MainTabSelected[title$="select-first-last-6.ts"]')
  const tabs = Locator('.MainTab')
  await expect(selectedTab).toBeVisible()
  await expect(tabs).toHaveCount(6)
}
