import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-large-file-warning'

// TODO enable after the static server includes FileSystem.getFileSize
export const skip = 1

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/large.txt`
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
  await Editor.shouldHaveText(testContent)
}
