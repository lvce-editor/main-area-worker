import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-last-then-first-of-four-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/select-last-first-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.selectTab(0, 3)
  await Main.selectTab(0, 0)

  const selectedTab = Locator('.MainTabSelected[title$="select-last-first-1.ts"]')
  const tabs = Locator('.MainTab')
  await expect(selectedTab).toBeVisible()
  await expect(tabs).toHaveCount(4)
}
