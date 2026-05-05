import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-active-editor-saves-modified-content'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'memfs' })
  const testFile = `${tmpDir}/close-save.ts`
  const initialContent = 'export const value = 1\n'
  const updatedContent = `// saved on close\n${initialContent}`

  await FileSystem.writeFile(testFile, initialContent)

  await Main.openUri(testFile)
  await Editor.shouldHaveText(initialContent)

  await Editor.setCursor(0, 0)
  await Editor.type('// saved on close\n')

  await Main.closeActiveEditor()

  await Main.openUri(testFile)
  await Editor.shouldHaveText(updatedContent)
}