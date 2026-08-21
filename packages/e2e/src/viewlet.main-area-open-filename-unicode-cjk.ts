import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-unicode-cjk'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = '文件.ts'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'export const value = true')

  await Main.openUri(file)

  const title = Locator('.MainTabSelected .TabTitle')
  await expect(title).toHaveText(fileName)
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
