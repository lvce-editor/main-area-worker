import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-error'
export const skip = 1

export const test: Test = async ({ expect, Extension, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/read-file-error')
  await Extension.addWebExtension(extensionUri)
  const prefix = 'extension-host://xyz://'
  await Workspace.setPath(prefix)
  const errorFile = `${prefix}/test.txt`

  // act
  await Main.openUri(errorFile)

  // assert
  const tab = Locator('.MainTab[title$="test.txt"]')
  await expect(tab).toBeVisible()
  const errorContent = Locator('.EditorContentError')
  await expect(errorContent).toBeVisible()
  // TODO improve error message
  await expect(errorContent).toHaveText(`Error: cannot append child: instance -1 not foundRetry`)
  const retryButton = Locator('.EditorContentError .Button')
  await expect(retryButton).toBeVisible()
  await expect(retryButton).toHaveText('Retry')
}
