import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-layout-show-preview-html-file'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const htmlFile = `${tmpDir}/test.html`
  const htmlContent = '<html><body><h1>Hello World</h1></body></html>'

  await FileSystem.writeFile(htmlFile, htmlContent)

  await Command.execute('Layout.showPreview', htmlFile)

  const preview = Locator('.Preview')
  await expect(preview).toBeVisible()
}
