import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-security-md'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileName = 'SECURITY.md'
  const file = `${tmpDir}/${fileName}`
  await FileSystem.writeFile(file, 'main area filename e2e test')

  await Main.openUri(file)

  const selectedTab = Locator(`.MainTabSelected[title$="${fileName}"]`)
  await expect(selectedTab).toBeVisible()
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
