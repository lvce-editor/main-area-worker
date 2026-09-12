import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-consumes-entry'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/restore-once.ts`
  await FileSystem.writeFile(file, 'restore once')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)
  await Main.closeActiveEditor()

  const tabs = Locator('.MainTab')
  const restoredTab = tabs.nth(0)
  await Command.execute('Main.restoreClosedTab')
  await expect(tabs).toHaveCount(1)

  await Command.execute('Main.restoreClosedTab')
  await expect(tabs).toHaveCount(1)
  const restoredTabTitle = restoredTab.locator('.TabTitle')
  await expect(restoredTabTitle).toHaveText('restore-once.ts')
}
