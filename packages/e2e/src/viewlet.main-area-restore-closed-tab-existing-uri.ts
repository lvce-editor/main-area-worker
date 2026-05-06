import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-existing-uri'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/restore-existing-1.ts`
  const file2 = `${tmpDir}/restore-existing-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.closeActiveEditor()
  await Main.openUri(file2)
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const mainTabs = Locator('.MainTab')
  await expect(mainTabs).toHaveCount(2)
  const existingTab = Locator('.MainTab[title$="restore-existing-2.ts"]')
  await expect(existingTab).toHaveCount(1)
  const selectedTab = Locator('.MainTabSelected[title$="restore-existing-2.ts"]')
  await expect(selectedTab).toBeVisible()
}
