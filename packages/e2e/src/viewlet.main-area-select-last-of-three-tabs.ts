import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-last-of-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/select-last-three-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.selectTab(0, 2)

  const selectedTab = Locator('.MainTabSelected[title$="select-last-three-3.ts"]')
  const tabs = Locator('.MainTab')
  await expect(selectedTab).toBeVisible()
  await expect(tabs).toHaveCount(3)
}
