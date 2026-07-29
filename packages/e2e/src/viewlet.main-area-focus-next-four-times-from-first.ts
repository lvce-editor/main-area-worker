import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-four-times-from-first'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/focus-next-four-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)

  for (let i = 0; i < 4; i++) {
    await Main.focusNext()
  }

  const locator1 = Locator('.MainTabSelected[title$="focus-next-four-5.ts"]')
  await expect(locator1).toBeVisible()
}
