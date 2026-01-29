import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file'

// export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  // act
  await Main.openUri(testFile)

  // assert
  const tab = Locator('.MainTab[title$="test.ts"]')
  await expect(tab).toBeVisible()
  // TODO
  // await Editor.shouldHaveText(testContent)
}
