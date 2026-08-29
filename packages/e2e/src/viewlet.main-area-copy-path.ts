import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-copy-path'

export const test: Test = async ({ ClipBoard, ContextMenu, expect, FileSystem, Locator, Main }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test-copy-path.ts`
  const testContent = 'export const test = () => "hello"'
  await FileSystem.writeFile(testFile, testContent)
  await Main.openUri(testFile)
  const tab = Locator('.MainTab[title$="test-copy-path.ts"]')
  await expect(tab).toBeVisible()

  // act - open tab context menu
  await Main.handleTabContextMenu(0, 0, 0)

  await ContextMenu.selectItem('Copy Path')

  // assert - verify clipboard contains the absolute path
  await ClipBoard.shouldHaveText(testFile)
}
