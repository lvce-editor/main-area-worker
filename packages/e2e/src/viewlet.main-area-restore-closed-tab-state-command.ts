import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-state-command'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/restore-command-1.ts`
  const file2 = `${tmpDir}/restore-command-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.closeActiveEditor()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  await expect(Locator('.MainTab[title$="restore-command-1.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="restore-command-2.ts"]')).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(2)
}
