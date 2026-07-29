import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-selected-and-reopen-of-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/close-reopen-three-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 1)
  await Main.closeActiveEditor()

  await Main.openUri(files[1])

  const reopenedTab = Locator('.MainTabSelected[title$="close-reopen-three-2.ts"]')
  const tabs = Locator('.MainTab')
  await expect(reopenedTab).toBeVisible()
  await expect(tabs).toHaveCount(3)
}
