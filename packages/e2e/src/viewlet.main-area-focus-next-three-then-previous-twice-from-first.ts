import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-three-then-previous-twice-from-first'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/focus-next-three-previous-two-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)

  for (let index = 0; index < 3; index++) {
    await Main.focusNext()
  }
  for (let index = 0; index < 2; index++) {
    await Main.focusPrevious()
  }

  const selectedTab = Locator('.MainTabSelected[title$="focus-next-three-previous-two-2.ts"]')
  await expect(selectedTab).toBeVisible()
}
