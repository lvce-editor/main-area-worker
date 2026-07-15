import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-two-tabs'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/restore-two-tabs-1.ts`
  const file2 = `${tmpDir}/restore-two-tabs-2.ts`

  await FileSystem.setFiles([
    { content: 'export const first = 1', uri: file1 },
    { content: 'export const second = 2', uri: file2 },
  ])

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.closeActiveEditor()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const mainTabs = Locator('.MainTab')
  await expect(mainTabs).toHaveCount(1)
  const selectedTab = Locator('.MainTabSelected[title$="restore-two-tabs-1.ts"]')
  await expect(selectedTab).toBeVisible()
}
