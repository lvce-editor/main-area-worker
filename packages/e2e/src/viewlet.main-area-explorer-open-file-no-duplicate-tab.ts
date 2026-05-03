import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-explorer-open-file-no-duplicate-tab'

export const test: Test = async ({ Explorer, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/open-once.ts`
  await FileSystem.writeFile(testFile, 'export const openOnce = true')
  await Workspace.setPath(tmpDir)
  await Explorer.refresh()

  const explorerItem = Locator('[role="treeitem"][title$="open-once.ts"]')
  await expect(explorerItem).toBeVisible()

  // act
  await Explorer.handleClick(0)
  await Explorer.handleClick(0)

  // assert
  const tab = Locator('.MainTab[title$="open-once.ts"]')
  await expect(tab).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
