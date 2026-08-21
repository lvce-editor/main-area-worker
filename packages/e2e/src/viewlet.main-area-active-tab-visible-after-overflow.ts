import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-active-tab-visible-after-overflow'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 12 }, (_, index) => `${tmpDir}/overflow-tab-with-a-long-name-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))

  await Main.openUris(files)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(12)
  const activeTab = Locator('.MainTabSelected[title$="overflow-tab-with-a-long-name-12.ts"]')
  await expect(activeTab).toBeVisible()
  const tabStrip = Locator('.MainTabs')
  await expect(tabStrip).toHaveJSProperty('scrollLeft', 1408)
}
