import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-three-groups'

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

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(2)
  const tab1 = Locator('.MainTab[title$="restore-groups-1.ts"]')
  await expect(tab1).toBeVisible()
  const tab3 = Locator('.MainTab[title$="restore-groups-3.ts"]')
  await expect(tab3).toBeVisible()
}
