import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-context-menu-reveal-in-explorer'

export const skip = false

export const test: Test = async ({ Command, ContextMenu, expect, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const folder = `${tmpDir}/nested/folder`
  const testFile = `${folder}/reveal-target.ts`
  await FileSystem.mkdir(folder)
  await FileSystem.writeFile(testFile, 'export const revealTarget = true')
  await Workspace.setPath(tmpDir)
  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="reveal-target.ts"]')
  await expect(tab).toBeVisible()

  // act - use the tab context menu while the sidebar is hidden
  await Command.execute('Layout.hideSideBar')
  await Main.handleTabContextMenu(0, 0, 0)
  const revealInExplorerMenuItem = Locator('text=Reveal in Explorer View')
  await expect(revealInExplorerMenuItem).toBeVisible()
  await ContextMenu.selectItem('Reveal in Explorer View')

  // assert
  const revealedFolder = Locator('[role="treeitem"][title$="folder"]')
  await expect(revealedFolder).toBeVisible()
  const revealedExplorerItem = Locator('[role="treeitem"][title$="reveal-target.ts"]')
  await expect(revealedExplorerItem).toBeVisible()
}
