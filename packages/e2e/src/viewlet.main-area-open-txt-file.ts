import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-txt-file'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.txt`
  const testContent = 'hello text file'
  await FileSystem.writeFile(testFile, testContent)

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="test.txt"]')
  await expect(tab).toBeVisible()

  const editor = Locator('.EditorText')
  await expect(editor).toBeVisible()
  await Editor.shouldHaveText(testContent)
}
