import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-middle'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/restore-middle-1.ts`
  const file2 = `${tmpDir}/restore-middle-2.ts`
  const file3 = `${tmpDir}/restore-middle-3.ts`

  await FileSystem.writeFile(file1, 'export const first = 1')
  await FileSystem.writeFile(file2, 'export const second = 2')
  await FileSystem.writeFile(file3, 'export const third = 3')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  await Main.selectTab(0, 1)
  await Main.closeActiveEditor()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const savedState = await Main.saveState(2)
  const [group] = savedState.layout.groups
  assert(group.tabs.length === 3, `Expected 3 tabs, got ${group.tabs.length}`)
  assert(group.tabs[0].uri === file1, `Expected first tab to be ${file1}, got ${group.tabs[0].uri}`)
  assert(group.tabs[1].uri === file2, `Expected second tab to be ${file2}, got ${group.tabs[1].uri}`)
  assert(group.tabs[2].uri === file3, `Expected third tab to be ${file3}, got ${group.tabs[2].uri}`)

  await expect(Locator('.MainTab')).toHaveCount(3)
  await expect(Locator('.MainTab[title$="restore-middle-1.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="restore-middle-2.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="restore-middle-3.ts"]')).toBeVisible()
  await expect(Locator('.MainTabSelected[title$="restore-middle-2.ts"]')).toBeVisible()
}
