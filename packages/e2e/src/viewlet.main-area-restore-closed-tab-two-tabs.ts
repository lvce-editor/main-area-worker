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
  await Command.execute('Main.restoreClosedTab')

  await expect(Locator('.MainTab')).toHaveCount(2)
  await expect(Locator('.MainTab[title$="restore-two-tabs-1.ts"]')).toBeVisible()
  await expect(Locator('.MainTabSelected[title$="restore-two-tabs-2.ts"]')).toBeVisible()
}
