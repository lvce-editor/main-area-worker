import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save-error'

export const test: Test = async ({ Editor, expect, Extension, Locator, Main, Workspace }) => {
  const extensionUri = import.meta.resolve('../fixtures/write-file-error')
  await Extension.addWebExtension(extensionUri)
  const prefix = 'extension-host://xyz://'
  await Workspace.setPath(prefix)
  const testFile = `${prefix}/save-error.txt`

  await Main.openUri(testFile)
  await Editor.shouldHaveText('Hello World')

  await Editor.setCursor(0, 0)
  await Editor.type('abc')

  const tab = Locator('.MainTab[title$="save-error.txt"]')
  await expect(tab).toHaveClass('MainTabModified')

  await Main.save()

  await expect(tab).toHaveClass('MainTabModified')
}
