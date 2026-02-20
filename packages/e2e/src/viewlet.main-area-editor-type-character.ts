import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-type-character'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/new-file.ts`

  await FileSystem.writeFile(testFile, '')
  await Main.openUri(testFile)

  await Editor.type('a')
  await Editor.shouldHaveText('a')
}
