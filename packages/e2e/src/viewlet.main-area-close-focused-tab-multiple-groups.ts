import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-focused-tab-multiple-groups'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/focused-left.ts`
  const file2 = `${tmpDir}/focused-right.ts`

  await FileSystem.writeFile(file1, 'left')
  await FileSystem.writeFile(file2, 'right')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.openUri(file2)
  await Main.selectTab(1, 0)

  await Command.execute('Main.closeFocusedTab')

  await expect(Locator('.MainTab[title$="focused-left.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="focused-right.ts"]')).toBeHidden()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
