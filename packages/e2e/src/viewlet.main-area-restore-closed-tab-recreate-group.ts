import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-recreate-group'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const fileLeft = `${tmpDir}/restore-left.ts`
  const fileRight = `${tmpDir}/restore-right.ts`

  await FileSystem.writeFile(fileLeft, 'left')
  await FileSystem.writeFile(fileRight, 'right')

  await Main.openUri(fileLeft)
  await Main.splitRight()

  await Main.openUri(fileRight)
  await Main.selectTab(0, 0)
  await Main.closeActiveEditor()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(1)
  const rightTab = Locator('.MainTab[title$="restore-right.ts"]')
  await expect(rightTab).toBeVisible()
}
