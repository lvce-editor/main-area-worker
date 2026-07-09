import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-after-closing-active'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/focus-previous-close-1.ts`
  const file2 = `${tmpDir}/focus-previous-close-2.ts`
  const file3 = `${tmpDir}/focus-previous-close-3.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
  await FileSystem.writeFile(file3, 'three')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  await Main.closeActiveEditor()
  await Main.focusPrevious()

  const locator1 = Locator('.MainTabSelected[title$="focus-previous-close-1.ts"]')
  await expect(locator1).toBeVisible()
}
