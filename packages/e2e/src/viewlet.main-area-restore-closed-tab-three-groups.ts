import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-three-groups'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/restore-groups-1.ts`
  const file2 = `${tmpDir}/restore-groups-2.ts`
  const file3 = `${tmpDir}/restore-groups-3.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
  await FileSystem.writeFile(file3, 'three')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.openUri(file2)
  await Main.splitRight()
  await Main.openUri(file3)

  await Main.selectTab(1, 0)
  await Main.closeActiveEditor()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const savedState = await Main.saveState(2)
  assert(savedState.layout.groups.length === 3, `Expected 3 groups, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[1].tabs[0].uri === file2, `Expected middle group to contain ${file2}`)

  await expect(Locator('.EditorGroup')).toHaveCount(3)
  await expect(Locator('.MainTab[title$="restore-groups-1.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="restore-groups-2.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="restore-groups-3.ts"]')).toBeVisible()
  await expect(Locator('.MainTabSelected[title$="restore-groups-2.ts"]')).toBeVisible()
}
