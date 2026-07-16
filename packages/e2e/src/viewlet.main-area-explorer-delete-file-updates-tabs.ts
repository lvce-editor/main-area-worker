import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-explorer-delete-file-updates-tabs'

export const skip = true

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Main, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const deletedFile = `${tmpDir}/a-delete-me.ts`
  const remainingFile = `${tmpDir}/b-keep-me.ts`
  await FileSystem.setFiles([
    { content: 'export const deletedFile = true', uri: deletedFile },
    { content: 'export const remainingFile = true', uri: remainingFile },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.refresh()

  const deletedExplorerItem = Locator('[role="treeitem"][title$="a-delete-me.ts"]')
  const remainingExplorerItem = Locator('[role="treeitem"][title$="b-keep-me.ts"]')
  const deletedTab = Locator('.MainTab[title$="a-delete-me.ts"]')
  const remainingTab = Locator('.MainTab[title$="b-keep-me.ts"]')
  const tabs = Locator('.MainTab')
  await expect(deletedExplorerItem).toBeVisible()
  await expect(remainingExplorerItem).toBeVisible()

  await Explorer.handleClick(0)
  await Main.openUri(remainingFile)

  await expect(deletedTab).toBeVisible()
  await expect(remainingTab).toBeVisible()
  await expect(tabs).toHaveCount(2)

  // act
  await Explorer.focusIndex(0)
  await Explorer.removeDirent()

  // assert
  await expect(deletedExplorerItem).toBeHidden()
  await expect(remainingExplorerItem).toBeVisible()
  await expect(deletedTab).toBeHidden()
  await expect(remainingTab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
