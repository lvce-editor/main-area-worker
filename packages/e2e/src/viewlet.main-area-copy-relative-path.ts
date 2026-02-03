import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-copy-relative-path'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const testFile = `${tmpDir}/test-copy-relative-path.ts`
  const testContent = 'export const test = () => "hello"'
  await FileSystem.writeFile(testFile, testContent)
  await Main.openUri(testFile)
  const tab = Locator('.MainTab[title$="test-copy-relative-path.ts"]')
  await expect(tab).toBeVisible()

  // act - open tab context menu
  await Command.execute('Main.handleTabContextMenu', 0, 0)

  // assert - verify Copy Relative Path menu item is visible
  const copyRelativePathMenuItem = Locator('text=Copy Relative Path')
  await expect(copyRelativePathMenuItem).toBeVisible()

  // act - execute copy relative path command
  await Command.execute('Main.copyRelativePath', testFile)

  // Note: Clipboard verification is not directly available in e2e tests,
  // but the command should execute without errors
}
