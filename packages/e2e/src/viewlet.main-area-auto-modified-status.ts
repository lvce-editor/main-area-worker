import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-auto-modified-status'

export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  // act - open a file
  await Main.openUri(testFile)

  // assert - tab should be visible and not dirty initially
  const tab = Locator('.MainTab[title$="test.ts"]')
  await expect(tab).toBeVisible()
  const tabTitle = Locator('.MainTab[title$="test.ts"] .TabTitle')
  await expect(tabTitle).toHaveText('test.ts')

  // act - type in the editor to modify it
  await Editor.setCursor(0, 0)
  await Editor.type('// comment\n')

  // assert - tab should automatically show modified status (asterisk)
  await expect(tabTitle).toHaveText('*test.ts')
}
