import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-then-reopen-unicode-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = '再開-🚀.ts'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'export const value = true')
  await Main.openUri(file)

  await Main.closeAllEditors()

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
  await Main.openUri(file)
  const title = Locator('.MainTabSelected .TabTitle')
  await expect(title).toHaveText(fileName)
  await expect(tabs).toHaveCount(1)
}
