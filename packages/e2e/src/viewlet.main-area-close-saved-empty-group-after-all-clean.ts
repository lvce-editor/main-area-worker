import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-saved-empty-group-after-all-clean'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/all-clean-1.ts`
  const file2 = `${tmpDir}/all-clean-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Command.execute('Main.closeSaved')

  await expect(Locator('.MainTab')).toHaveCount(0)
}
