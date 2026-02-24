import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-error-retry'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const retryFile = `${tmpDir}/retry-file.ts`
  const fileContent = 'export const retry = () => "success"'

  // act - open file that doesn't exist yet
  await Main.openUri(retryFile)

  // assert - verify error is shown
  const tab = Locator('.MainTab[title$="retry-file.ts"]')
  await expect(tab).toBeVisible()

  const errorContent = Locator('.EditorContent--error')
  await expect(errorContent).toBeVisible()
  await expect(errorContent).toContainText('File not found')

  // act - create the file and click retry
  await FileSystem.writeFile(retryFile, fileContent)
  const retryButton = Locator('.EditorContent--error .Button')
  await expect(retryButton).toBeVisible()
  await expect(retryButton).toHaveText('Retry')
  await retryButton.click()

  // assert - verify file contents are now displayed
  const editorContent = Locator('.EditorContent')
  await expect(editorContent).toBeVisible()
  // The error content should no longer be visible
  await expect(errorContent).not.toBeVisible()
}
