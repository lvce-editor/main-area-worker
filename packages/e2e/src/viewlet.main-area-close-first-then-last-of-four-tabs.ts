import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-first-then-last-of-four-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/close-first-last-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 0)
  await Main.closeActiveEditor()
  await Main.selectTab(0, 2)

  await Main.closeActiveEditor()

  const firstClosedTab = Locator('.MainTab[title$="close-first-last-1.ts"]')
  const lastClosedTab = Locator('.MainTab[title$="close-first-last-4.ts"]')
  const tabs = Locator('.MainTab')
  await expect(firstClosedTab).toBeHidden()
  await expect(lastClosedTab).toBeHidden()
  await expect(tabs).toHaveCount(2)
}
