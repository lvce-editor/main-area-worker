import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-twice-from-first'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/focus-next-twice-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }
  await Main.selectTab(0, 0)

  await Main.focusNext()
  await Main.focusNext()

  const locator1 = Locator('.MainTabSelected[title$="focus-next-twice-3.ts"]')
  await expect(locator1).toBeVisible()
}
