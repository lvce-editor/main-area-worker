import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-preserves-two-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [`${tmpDir}/split-right-two-1.ts`, `${tmpDir}/split-right-two-2.ts`]
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  await Main.splitRight()

  const locator1 = Locator('.EditorGroup')
  await expect(locator1).toHaveCount(2)
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(2)
  const locator3 = Locator('.MainTab[title$="split-right-two-1.ts"]')
  await expect(locator3).toBeVisible()
  const locator4 = Locator('.MainTab[title$="split-right-two-2.ts"]')
  await expect(locator4).toBeVisible()
}
