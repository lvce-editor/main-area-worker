import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-clear-save-reopen'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'memfs' })
  const testFile = `${tmpDir}/clear-me.ts`
  const initialContent = 'export const value = 42\n'

  await FileSystem.writeFile(testFile, initialContent)
  await Main.openUri(testFile)
  await Editor.shouldHaveText(initialContent)

  await Editor.selectAll()
  await Editor.deleteAll()
  await Main.save()

  await Main.closeActiveEditor()
  await Main.openUri(testFile)
  await Editor.shouldHaveText('')
}
