import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-large-file-warning'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Settings }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const testFile = `${tmpDir}/lvce-editor-large-file-warning.txt`
  const testContent = 'large file content '.repeat(128)
  // Keep this file-loading regression independent of downloadable font support.
  await Settings.update({ 'files.maxFileSizeMB': 0.001, 'editor.fontFamily': 'monospace' })
  await FileSystem.writeFile(testFile, testContent)

  await Main.openUri(testFile)

  const warning = Locator('.EditorContentLargeFile')
  await expect(warning).toContainText('The file is not displayed in the text editor because it is very large')
  await expect(warning).toContainText('Open Anyway')
  await expect(warning).toContainText('Configure Limit')

  await warning.locator('[name="open-large-file"]').click()

  await expect(warning).toBeHidden()
  await Editor.shouldHaveText(testContent)
  const editorContent = Locator('.EditorContent')
  await expect(editorContent).toBeVisible()
}
