import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-multiple-binary-files'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [`${tmpDir}/module.beam`, `${tmpDir}/manual.pdf`]
  await FileSystem.setFiles(files.map((uri) => ({ content: 'binary content', uri })))

  await Main.openUris(files)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
  const selectedPdfTab = Locator('.MainTabSelected[title$="manual.pdf"]')
  await expect(selectedPdfTab).toBeVisible()
  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')

  await Main.selectTab(0, 0)

  const selectedBeamTab = Locator('.MainTabSelected[title$="module.beam"]')
  await expect(selectedBeamTab).toBeVisible()
  await expect(binaryContent).toBeVisible()
}
