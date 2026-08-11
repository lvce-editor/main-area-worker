import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-binary-file'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/archive.zip`
  const testContent = 'binary file text override'
  await FileSystem.writeFile(testFile, testContent)

  await Main.openUri(testFile)

  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')

  const openInTextEditorButton = Locator('.EditorContentBinary .Button')
  await openInTextEditorButton.click()

  await expect(binaryContent).toBeHidden()
  await Editor.shouldHaveText(testContent)
}
