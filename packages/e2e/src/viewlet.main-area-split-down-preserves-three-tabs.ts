import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-down-preserves-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/split-down-three-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.splitDown()

  const locator1 = Locator('.EditorGroup')
  await expect(locator1).toHaveCount(2)
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(3)
  for (let i = 1; i <= 3; i++) {
    const locator3 = Locator(`.MainTab[title$="split-down-three-${i}.ts"]`)
    await expect(locator3).toBeVisible()
  }
}
