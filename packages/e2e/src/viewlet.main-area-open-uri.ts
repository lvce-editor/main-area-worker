import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uri'

export const test: Test = async ({ Command, Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir(Editor)
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  // act
  await Main.openUri(testFile)

  // assert
  await Editor.shouldHaveText(testContent)
}
