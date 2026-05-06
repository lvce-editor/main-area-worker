import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-middle'

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

  const mainTabs = Locator('.MainTab')
  await expect(mainTabs).toHaveCount(2)
  const tab1 = Locator('.MainTab[title$="restore-middle-1.ts"]')
  await expect(tab1).toBeVisible()
  const tab3 = Locator('.MainTab[title$="restore-middle-3.ts"]')
  await expect(tab3).toBeVisible()
}
