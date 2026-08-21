import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-same-file-ten-times-concurrently'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'concurrent-ten-times.ts'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'export const value = true')

  await Promise.all(Array.from({ length: 10 }, () => Main.openUri(file)))

  const title = Locator('.MainTabSelected .TabTitle')
  await expect(title).toHaveText(fileName)
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
