import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-middle'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/restore-middle-1.ts`
  const file2 = `${tmpDir}/restore-middle-2.ts`
  const file3 = `${tmpDir}/restore-middle-3.ts`

  await FileSystem.setFiles([
    { content: 'export const first = 1', uri: file1 },
    { content: 'export const second = 2', uri: file2 },
    { content: 'export const third = 3', uri: file3 },
  ])

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  await Main.selectTab(0, 1)
  await Main.closeActiveEditor()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const mainTabs = Locator('.MainTab')
  const firstTab = mainTabs.nth(0)
  const restoredTab = mainTabs.nth(1)
  const lastTab = mainTabs.nth(2)
  await expect(mainTabs).toHaveCount(3)
  const firstTabTitle = firstTab.locator('.TabTitle')
  await expect(firstTabTitle).toHaveText('restore-middle-1.ts')
  const restoredTabTitle = restoredTab.locator('.TabTitle')
  await expect(restoredTabTitle).toHaveText('restore-middle-2.ts')
  const lastTabTitle = lastTab.locator('.TabTitle')
  await expect(lastTabTitle).toHaveText('restore-middle-3.ts')
  await expect(restoredTab).toHaveAttribute('aria-selected', 'true')
}
