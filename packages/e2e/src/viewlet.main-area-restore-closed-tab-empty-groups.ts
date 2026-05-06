import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-empty-groups'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Main.splitRight()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(2)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)

  assert(true, 'restore closed tab should be a no-op with no closed tabs')
}
