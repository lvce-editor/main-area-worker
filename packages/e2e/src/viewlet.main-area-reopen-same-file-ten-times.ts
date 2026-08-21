import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reopen-same-file-ten-times'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'reopen-ten-times.ts'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'export const value = true')

  for (let index = 0; index < 10; index++) {
    await Main.openUri(file)
  }

  const title = Locator('.MainTabSelected .TabTitle')
  await expect(title).toHaveText(fileName)
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
