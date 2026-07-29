import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-six-times-from-first-of-six'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 6 }, (_, index) => `${tmpDir}/focus-next-six-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)

  for (let index = 0; index < 6; index++) {
    await Main.focusNext()
  }

  const selectedTab = Locator('.MainTabSelected[title$="focus-next-six-1.ts"]')
  await expect(selectedTab).toBeVisible()
}
