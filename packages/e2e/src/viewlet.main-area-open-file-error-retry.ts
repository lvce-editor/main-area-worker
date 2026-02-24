import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-error-retry'

// export const skip = 1

export const test: Test = async ({ Command, Editor, expect, Extension, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/read-file-error')
  await Extension.addWebExtension(extensionUri)
  const prefix = 'extension-host://xyz://'
  await Workspace.setPath(prefix)
  await Main.openUri(`${prefix}/test.txt`)
  const tab = Locator('.MainTab[title$="test.txt"]')
  await expect(tab).toBeVisible()
  const errorContent = Locator('.EditorContentError')
  await expect(errorContent).toBeVisible()
  const retryButton = Locator('.EditorContentError .Button')
  await expect(retryButton).toBeVisible()
  await expect(retryButton).toHaveText('Retry')

  // act
  await Command.execute('Main.handleClickAction', 'retry-open')

  // assert
  const editorContent = Locator('.EditorContent')
  await expect(editorContent).toBeVisible()
  await expect(errorContent).toBeHidden()
  await Editor.shouldHaveText('Hello WOrld')
}
