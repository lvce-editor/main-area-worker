import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-large-file-warning'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const testFile = `${tmpDir}/lvce-editor-large-file-warning.txt`
  const testContent = 'large file content '.repeat(128)
  await Settings.update({ 'files.maxFileSizeMB': 0.001 })
  await FileSystem.writeFile(testFile, testContent)

  await Main.openUri(testFile)

  const warning = Locator('.EditorContentLargeFile')
  await expect(warning).toContainText('The file is not displayed in the text editor because it is very large')
  await expect(warning).toContainText('Open Anyway')
  await expect(warning).toContainText('Configure Limit')

  await Command.execute('Main.handleClickAction', 'open-large-file')

  await expect(warning).toBeHidden()
  let lastError: Error | undefined
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      await Editor.shouldHaveText(testContent)
      lastError = undefined
      break
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Editor text assertion failed')
      await Command.execute('Timeout.sleep', 200)
    }
  }
  if (lastError) {
    throw lastError
  }
  const editorContent = Locator('.EditorContent')
  await expect(editorContent).toBeVisible()
}
