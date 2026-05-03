import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-explorer-delete-file-updates-tabs'

export const test: Test = async ({ Explorer, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const deletedFile = `${tmpDir}/a-delete-me.ts`
  const remainingFile = `${tmpDir}/b-keep-me.ts`
  await FileSystem.writeFile(deletedFile, 'export const deletedFile = true')
  await FileSystem.writeFile(remainingFile, 'export const remainingFile = true')
  await Workspace.setPath(tmpDir)
  await Explorer.refresh()

  const deletedExplorerItem = Locator('[role="treeitem"][title$="a-delete-me.ts"]')
  const remainingExplorerItem = Locator('[role="treeitem"][title$="b-keep-me.ts"]')
  const deletedTab = Locator('.MainTab[title$="a-delete-me.ts"]')
  const remainingTab = Locator('.MainTab[title$="b-keep-me.ts"]')
  await expect(deletedExplorerItem).toBeVisible()
  await expect(remainingExplorerItem).toBeVisible()

  await Explorer.handleClick(0)
  await Explorer.handleClick(1)

  await expect(deletedTab).toBeVisible()
  await expect(remainingTab).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(2)

  // act
  await Explorer.focusIndex(0)
  await Explorer.removeDirent()

  // assert
  await expect(deletedExplorerItem).toBeHidden()
  await expect(remainingExplorerItem).toBeVisible()
  await expect(deletedTab).toBeHidden()
  await expect(remainingTab).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
