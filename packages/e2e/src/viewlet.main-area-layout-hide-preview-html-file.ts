import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-layout-hide-preview-html-file'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const htmlFile = `${tmpDir}/test.html`
  const htmlContent = '<html><body><h1>Hello World</h1></body></html>'

  await FileSystem.writeFile(htmlFile, htmlContent)

  const preview = Locator('.Preview')
  await Command.execute('Layout.showPreview', htmlFile)
  await expect(preview).toBeVisible()

  await Command.execute('Layout.hidePreview')

  await expect(preview).toBeHidden()
}
