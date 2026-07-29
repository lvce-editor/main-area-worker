import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-after-select-first'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/focus-previous-after-first-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)

  await Main.focusPrevious()

  const selectedTab = Locator('.MainTabSelected[title$="focus-previous-after-first-4.ts"]')
  await expect(selectedTab).toBeVisible()
}
