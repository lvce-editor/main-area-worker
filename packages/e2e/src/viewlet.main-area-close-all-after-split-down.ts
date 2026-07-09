import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-after-split-down'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-all-split-down-1.ts`
  const file2 = `${tmpDir}/close-all-split-down-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.splitDown()
  await Main.openUri(file2)
  await Main.closeAllEditors()

  const locator1 = Locator('.MainTab')
  await expect(locator1).toHaveCount(0)
  const locator2 = Locator('.EditorGroup')
  await expect(locator2).toHaveCount(2)
}
