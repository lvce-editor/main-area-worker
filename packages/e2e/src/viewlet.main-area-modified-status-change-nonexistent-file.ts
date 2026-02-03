import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-modified-status-change-nonexistent-file'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)
  await Main.openUri(testFile)
  const tab = Locator('.MainTab[title$="test.ts"]')
  await expect(tab).toBeVisible()

  // act
  const nonExistentUri = `${tmpDir}/does-not-exist.ts`
  await Command.execute('Main.handleModifiedStatusChange', nonExistentUri, true)

  // assert
  await expect(tab).toBeVisible()
}
