import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-toggle-preview-html-file'

export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const htmlFile = `${tmpDir}/test.html`
  const htmlContent = '<html><body><h1>Hello World</h1></body></html>'
  await FileSystem.writeFile(htmlFile, htmlContent)
  await Main.openUri(htmlFile)

  const tab = Locator('.MainTab[title$="test.html"]')
  await expect(tab).toBeVisible()

  // act
  await Command.execute('Main.handleClickTogglePreview')

  // assert
  const preview = Locator('.Preview')
  await expect(preview).toBeVisible()
}
