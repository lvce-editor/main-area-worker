import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-deeply-nested-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const segments = Array.from({ length: 12 }, (_, index) => 'level-' + (index + 1))
  const folder = `${tmpDir}/${segments.join('/')}`
  const fileName = 'deep.ts'
  const file = `${folder}/${fileName}`
  await FileSystem.mkdir(folder)
  await FileSystem.writeFile(file, 'export const value = true')

  await Main.openUri(file)

  const title = Locator('.MainTabSelected .TabTitle')
  await expect(title).toHaveText(fileName)
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
