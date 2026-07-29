import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-numeric'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = '123.ts'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'export const value = 123')

  await Main.openUri(file)

  const tab = Locator(`.MainTabSelected[title$="${fileName}"]`)
  await expect(tab).toBeVisible()
  const locator1 = Locator('.MainTab')
  await expect(locator1).toHaveCount(1)
}
