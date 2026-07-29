import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-six-times-from-last-of-six'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 6 }, (_, index) => `${tmpDir}/focus-previous-six-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 5)

  for (let index = 0; index < 6; index++) {
    await Main.focusPrevious()
  }

  const selectedTab = Locator('.MainTabSelected[title$="focus-previous-six-6.ts"]')
  await expect(selectedTab).toBeVisible()
}
