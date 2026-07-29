import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-three-then-next-twice-from-last'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/focus-previous-three-next-two-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 4)

  for (let index = 0; index < 3; index++) {
    await Main.focusPrevious()
  }
  for (let index = 0; index < 2; index++) {
    await Main.focusNext()
  }

  const selectedTab = Locator('.MainTabSelected[title$="focus-previous-three-next-two-4.ts"]')
  await expect(selectedTab).toBeVisible()
}
