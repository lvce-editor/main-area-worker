import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  // act
  await Main.openUri(testFile)

  // assert
  await Editor.shouldHaveText(testContent)
}
