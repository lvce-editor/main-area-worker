import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-error'

export const test: Test = async ({ expect, Extension, Locator, Main, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/read-file-null-error')
  await Extension.addWebExtension(extensionUri)
  const prefix = 'extension-host://xyz://'
  await Workspace.setPath(prefix)
  const errorFile = `${prefix}/error-file.ts`

  // act
  await Main.openUri(errorFile)

  // assert
  const tab = Locator('.MainTab[title$="error-file.ts"]')
  await expect(tab).toBeVisible()

  const errorContent = Locator('.EditorContentError')
  await expect(errorContent).toBeVisible()
  // TODO improve error message
  await expect(errorContent).toHaveText(`Error: cannot append child: instance -1 not found`)
  const retryButton = Locator('.EditorContentError .Button')
  await expect(retryButton).toBeVisible()
  await expect(retryButton).toHaveText('Retry')
}
