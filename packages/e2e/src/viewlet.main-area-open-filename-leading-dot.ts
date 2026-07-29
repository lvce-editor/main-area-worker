import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-leading-dot'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = '.env'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'KEY=value')

  await Main.openUri(file)

  const tab = Locator(`.MainTabSelected[title$="${fileName}"]`)
  await expect(tab).toBeVisible()
  const locator1 = Locator('.MainTab')
  await expect(locator1).toHaveCount(1)
}
