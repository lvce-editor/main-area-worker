import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-tbr-binary-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/archive.tbr`
  await FileSystem.writeFile(file, 'compressed archive')

  await Main.openUri(file)

  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')
  const selectedTab = Locator('.MainTabSelected[title$="archive.tbr"]')
  await expect(selectedTab).toBeVisible()
}
