import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-error-retry'

export const skip = 1

export const test: Test = async ({ expect, Extension, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/read-file-error')
  await Extension.addWebExtension(extensionUri)
  const prefix = 'extension-host://xyz://'
  await Workspace.setPath(prefix)
  const retryFile = `${prefix}/test.txt.ts`
  await Main.openUri(retryFile)
  const tab = Locator('.MainTab[title$="test.txt"]')
  await expect(tab).toBeVisible()
  const errorContent = Locator('.EditorContentError')
  await expect(errorContent).toBeVisible()
  const retryButton = Locator('.EditorContentError .Button')
  await expect(retryButton).toBeVisible()
  await expect(retryButton).toHaveText('Retry')

  // act
  await retryButton.click()

  // assert
  const editorContent = Locator('.EditorContent')
  await expect(editorContent).toBeVisible()
  await expect(errorContent).toBeHidden()
}
