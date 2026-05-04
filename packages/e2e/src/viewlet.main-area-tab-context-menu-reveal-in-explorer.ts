import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-context-menu-reveal-in-explorer'

export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/reveal-target.ts`
  await FileSystem.writeFile(testFile, 'export const revealTarget = true')
  await Workspace.setPath(tmpDir)
  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="reveal-target.ts"]')
  await expect(tab).toBeVisible()

  // act
  await Command.execute('MainArea.handleTabContextMenu', 0, 0, 0)
  const revealInExplorerMenuItem = Locator('text=Reveal in Explorer View')
  await expect(revealInExplorerMenuItem).toBeVisible()
  await Command.execute('Explorer.revealItem', testFile)

  // assert
  const revealedExplorerItem = Locator('[role="treeitem"][title$="reveal-target.ts"]')
  await expect(revealedExplorerItem).toBeVisible()
}
