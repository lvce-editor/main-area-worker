import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-twice-from-middle-of-five'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/focus-previous-middle-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 2)

  await Main.focusPrevious()
  await Main.focusPrevious()

  const selectedTab = Locator('.MainTabSelected[title$="focus-previous-middle-1.ts"]')
  await expect(selectedTab).toBeVisible()
}
