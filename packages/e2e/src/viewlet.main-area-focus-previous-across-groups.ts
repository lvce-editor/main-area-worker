import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-across-groups'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/previous-left.ts`
  const file2 = `${tmpDir}/previous-right.ts`

  await FileSystem.writeFile(file1, 'left')
  await FileSystem.writeFile(file2, 'right')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.openUri(file2)
  await Main.selectTab(1, 0)

  await Main.focusPrevious()

  await expect(Locator('.MainTabSelected[title$="previous-left.ts"]')).toBeVisible()
}
