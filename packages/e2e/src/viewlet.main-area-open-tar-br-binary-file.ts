import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-tar-br-binary-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/archive.tar.br`
  await FileSystem.writeFile(file, 'brotli tar archive')

  await Main.openUri(file)

  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')
  const selectedTab = Locator('.MainTabSelected[title$="archive.tar.br"]')
  await expect(selectedTab).toBeVisible()
}
