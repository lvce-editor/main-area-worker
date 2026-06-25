import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-across-groups'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/focus-left.ts`
  const file2 = `${tmpDir}/focus-right.ts`

  await FileSystem.writeFile(file1, 'left')
  await FileSystem.writeFile(file2, 'right')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.openUri(file2)
  await Main.selectTab(0, 0)

  await Main.focusNext()

  await expect(Locator('.MainTabSelected[title$="focus-right.ts"]')).toBeVisible()
}
