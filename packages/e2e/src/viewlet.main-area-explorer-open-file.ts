import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-explorer-open-file'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/opened-from-explorer.ts`
  await FileSystem.writeFile(testFile, 'export const openedFromExplorer = true')
  await Workspace.setPath(tmpDir)
  await Explorer.refresh()

  const explorerItem = Locator('[role="treeitem"][title$="opened-from-explorer.ts"]')
  await expect(explorerItem).toBeVisible()

  // act
  await Explorer.handleClick(0)

  // assert
  const tab = Locator('.MainTab[title$="opened-from-explorer.ts"]')
  await expect(tab).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
