import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-css-file'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'memfs' })
  const testFile = `${tmpDir}/test.css`
  const testContent = 'body { color: red; }'
  await FileSystem.writeFile(testFile, testContent)

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="test.css"]')
  await expect(tab).toBeVisible()

  await Editor.shouldHaveText(testContent)
}
