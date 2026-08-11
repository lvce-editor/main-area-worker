import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-binary-file-with-spaces'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/release artifact.tar.gz`
  await FileSystem.writeFile(file, 'compressed tar archive')

  await Main.openUri(file)

  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')
  const selectedTab = Locator('.MainTabSelected[title$="release artifact.tar.gz"]')
  await expect(selectedTab).toBeVisible()
}
