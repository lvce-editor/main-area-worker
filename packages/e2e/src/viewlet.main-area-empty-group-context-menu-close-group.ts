import type { Test } from '@lvce-editor/test-with-playwright'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const name = 'viewlet.main-area-empty-group-context-menu-close-group'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Main.splitRight()

  const beforeState = await Main.saveState(2)
  const sourceGroupId = beforeState.layout.groups[1].id

  await Command.execute('Main.handleContextMenu', String(sourceGroupId), 10, 10)

  const closeGroupMenuItem = Locator('text=Close Editor Group')
  await expect(closeGroupMenuItem).toBeVisible()
  await Command.execute('MainArea.closeEditorGroup', sourceGroupId)

  const afterState = await Main.saveState(2)
  assert(afterState.layout.groups.length === 1, `Expected 1 group, got ${afterState.layout.groups.length}`)
  assert(afterState.layout.groups[0].id !== sourceGroupId, `Expected group ${sourceGroupId} to be removed`)
}
