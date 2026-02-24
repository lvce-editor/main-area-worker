import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-error'

// export const skip = 1

export const test: Test = async ({ expect, Extension, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/read-file-error')
  await Extension.addWebExtension(extensionUri)
  const prefix = 'extension-host://xyz://'
  await Workspace.setPath(prefix)
  const errorFile = `${prefix}/error-file.ts`

  // act
  await Main.openUri(errorFile)

  // assert
  const tab = Locator('.MainTab[title$="error-file.ts"]')
  await expect(tab).toBeVisible()

  const errorContent = Locator('.EditorContent--error')
  await expect(errorContent).toBeVisible()
  // await expect(errorContent).toContainText('File not found')

  const retryButton = Locator('.EditorContent--error .Button')
  await expect(retryButton).toBeVisible()
  await expect(retryButton).toHaveText('Retry')
}
