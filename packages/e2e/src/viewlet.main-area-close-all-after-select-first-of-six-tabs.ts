import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-after-select-first-of-six-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 6 }, (_, index) => `${tmpDir}/close-all-select-first-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)

  await Main.closeAllEditors()

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
}
