import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-binary-file-selects-text-neighbor'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const textFile = `${tmpDir}/neighbor.txt`
  const binaryFile = `${tmpDir}/neighbor.beam`
  await FileSystem.setFiles([
    { content: 'neighbor text content', uri: textFile },
    { content: 'FOR1BEAMAtU8C', uri: binaryFile },
  ])
  await Main.openUris([textFile, binaryFile])

  await Main.closeActiveEditor()

  const selectedTextTab = Locator('.MainTabSelected[title$="neighbor.txt"]')
  await expect(selectedTextTab).toBeVisible()
  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toBeHidden()
  await Editor.shouldHaveText('neighbor text content')
}
