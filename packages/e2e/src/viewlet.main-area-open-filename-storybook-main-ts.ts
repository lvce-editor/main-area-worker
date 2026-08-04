import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-storybook-main-ts'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'storybook.main.ts'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'main area filename e2e test')

  await Main.openUri(file)

  const selectedTab = Locator(`.MainTabSelected[title$="${fileName}"]`)
  await expect(selectedTab).toBeVisible()
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
