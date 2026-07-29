import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-last-three-times-of-five-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 5 }, (_, index) => `${tmpDir}/close-last-three-times-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)
  await Main.selectTab(0, 4)

  for (let index = 0; index < 3; index++) {
    await Main.closeActiveEditor()
  }

  const closedTab = Locator('.MainTab[title$="close-last-three-times-3.ts"]')
  const remainingTab = Locator('.MainTab[title$="close-last-three-times-2.ts"]')
  const tabs = Locator('.MainTab')
  await expect(closedTab).toBeHidden()
  await expect(remainingTab).toBeVisible()
  await expect(tabs).toHaveCount(2)
}
