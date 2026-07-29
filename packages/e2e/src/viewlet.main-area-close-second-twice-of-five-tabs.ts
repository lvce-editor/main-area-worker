import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-second-twice-of-five-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/close-second-twice-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 1)

  await Main.closeActiveEditor()
  await Main.closeActiveEditor()

  const firstClosedTab = Locator('.MainTab[title$="close-second-twice-2.ts"]')
  const secondClosedTab = Locator('.MainTab[title$="close-second-twice-3.ts"]')
  const tabs = Locator('.MainTab')
  await expect(firstClosedTab).toBeHidden()
  await expect(secondClosedTab).toBeHidden()
  await expect(tabs).toHaveCount(3)
}
