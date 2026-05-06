import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-two-tabs'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/restore-two-tabs-1.ts`
  const file2 = `${tmpDir}/restore-two-tabs-2.ts`

  await FileSystem.writeFile(file1, 'export const first = 1')
  await FileSystem.writeFile(file2, 'export const second = 2')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.closeActiveEditor()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const savedState = await Main.saveState(2)
  const [group] = savedState.layout.groups
  if (group.tabs.length !== 2) {
    throw new Error(`Expected 2 tabs, got ${group.tabs.length}`)
  }
  if (group.tabs[0].uri !== file1) {
    throw new Error(`Expected first tab to be ${file1}, got ${group.tabs[0].uri}`)
  }
  if (group.tabs[1].uri !== file2) {
    throw new Error(`Expected second tab to be ${file2}, got ${group.tabs[1].uri}`)
  }

  await expect(Locator('.MainTab')).toHaveCount(2)
  await expect(Locator('.MainTab[title$="restore-two-tabs-1.ts"]')).toBeVisible()
  await expect(Locator('.MainTabSelected[title$="restore-two-tabs-2.ts"]')).toBeVisible()
}
