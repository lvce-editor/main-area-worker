import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-copy-path'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test-copy-path.ts`
  const testContent = 'export const test = () => "hello"'
  await FileSystem.writeFile(testFile, testContent)
  await Main.openUri(testFile)
  const tab = Locator('.MainTab[title$="test-copy-path.ts"]')
  await expect(tab).toBeVisible()

  // act - open tab context menu
  await Command.execute('Main.handleTabContextMenu', 0, 0)

  // assert - verify Copy Path menu item is visible
  const copyPathMenuItem = Locator('text=Copy Path')
  await expect(copyPathMenuItem).toBeVisible()

  // act - execute copy path command
  await Command.execute('Main.copyPath', testFile)

  // Note: Clipboard verification is not directly available in e2e tests,
  // but the command should execute without errors
}
