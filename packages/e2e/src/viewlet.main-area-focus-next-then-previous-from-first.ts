import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-then-previous-from-first'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/focus-next-previous-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)

  await Main.focusNext()
  await Main.focusPrevious()

  const selectedTab = Locator('.MainTabSelected[title$="focus-next-previous-1.ts"]')
  await expect(selectedTab).toBeVisible()
}
