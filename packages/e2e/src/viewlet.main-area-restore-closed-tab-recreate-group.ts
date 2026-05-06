import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-recreate-group'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

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
  await Command.execute('Main.restoreClosedTab')

  const savedState = await Main.saveState(2)
  assert(savedState.layout.groups.length === 2, `Expected 2 groups, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].tabs[0].uri === fileLeft, `Expected first group to contain ${fileLeft}`)
  assert(savedState.layout.groups[1].tabs[0].uri === fileRight, `Expected second group to contain ${fileRight}`)

  await expect(Locator('.EditorGroup')).toHaveCount(2)
  await expect(Locator('.MainTab[title$="restore-left.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="restore-right.ts"]')).toBeVisible()
  await expect(Locator('.MainTabSelected[title$="restore-left.ts"]')).toBeVisible()
}
