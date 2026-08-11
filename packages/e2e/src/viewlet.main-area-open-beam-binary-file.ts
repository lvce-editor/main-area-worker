import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-beam-binary-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/hello.beam`
  await FileSystem.writeFile(file, 'FOR1BEAMAtU8C')

  await Main.openUri(file)

  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')
  const selectedTab = Locator('.MainTabSelected[title$="hello.beam"]')
  await expect(selectedTab).toBeVisible()
}
