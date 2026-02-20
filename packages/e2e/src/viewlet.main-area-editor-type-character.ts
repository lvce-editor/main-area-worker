import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-type-character'

export const test: Test = async ({ Editor, FileSystem, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const testFile = `${tmpDir}/new-file.ts`
  await FileSystem.writeFile(testFile, '\n')
  await Main.openUri(testFile)
  await Editor.setCursor(0, 0)

  // act
  await Editor.type('a')

  // assert
  await Editor.shouldHaveText('a\n')
}
