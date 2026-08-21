import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-unicode-folder'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const folder = `${tmpDir}/文件夹-🚀`
  const fileName = 'nested.ts'
  const file = `${folder}/${fileName}`
  await FileSystem.mkdir(folder)
  await FileSystem.writeFile(file, 'export const value = true')

  await Main.openUri(file)

  const title = Locator('.MainTabSelected .TabTitle')
  await expect(title).toHaveText(fileName)
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
