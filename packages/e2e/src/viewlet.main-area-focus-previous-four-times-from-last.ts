import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-four-times-from-last'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/focus-previous-four-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }

  for (let i = 0; i < 4; i++) {
    await Main.focusPrevious()
  }

  const locator1 = Locator('.MainTabSelected[title$="focus-previous-four-1.ts"]')
  await expect(locator1).toBeVisible()
}
