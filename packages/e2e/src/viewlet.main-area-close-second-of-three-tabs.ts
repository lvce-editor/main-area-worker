import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-second-of-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/close-second-three-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 1)

  await Main.closeActiveEditor()

  const closedTab = Locator('.MainTab[title$="close-second-three-2.ts"]')
  const tabs = Locator('.MainTab')
  await expect(closedTab).toBeHidden()
  await expect(tabs).toHaveCount(2)
}
