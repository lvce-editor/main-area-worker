import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-toggle-preview-invalid-html'

export const skip = true

export const test: Test = async ({ expect, FileSystem, Locator, Main, Command }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const invalidHtmlFile = `${tmpDir}/invalid.html`
  const invalidContent = '<html><body><h1>Unclosed header</body></html>'
  await FileSystem.writeFile(invalidHtmlFile, invalidContent)
  await Main.openUri(invalidHtmlFile)

  const tab = Locator('.MainTab[title$="invalid.html"]')
  await expect(tab).toBeVisible()

  // act
  await Command.execute('Main.handleClickTogglePreview')

  // assert
  const preview = Locator('.Preview')
  await expect(preview).toBeVisible()
  const errorMessage = Locator('.Preview .error-message')
  await expect(errorMessage).toBeVisible()
}
