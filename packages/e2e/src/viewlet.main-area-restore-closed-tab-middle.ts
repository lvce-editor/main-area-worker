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
  await expect(mainTabs).toHaveCount(3)
  await expect(mainTabs.nth(0).locator('.TabTitle')).toHaveText('restore-middle-1.ts')
  await expect(mainTabs.nth(1).locator('.TabTitle')).toHaveText('restore-middle-2.ts')
  await expect(mainTabs.nth(2).locator('.TabTitle')).toHaveText('restore-middle-3.ts')
  await expect(mainTabs.nth(1)).toHaveAttribute('aria-selected', 'true')
}
