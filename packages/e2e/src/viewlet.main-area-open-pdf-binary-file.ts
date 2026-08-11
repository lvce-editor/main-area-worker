import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-pdf-binary-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/document.pdf`
  await FileSystem.writeFile(file, '%PDF-1.7')

  await Main.openUri(file)

  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')
  const selectedTab = Locator('.MainTabSelected[title$="document.pdf"]')
  await expect(selectedTab).toBeVisible()
}
