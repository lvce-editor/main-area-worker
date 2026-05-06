import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-empty-groups'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Main.splitRight()
  await Command.execute('Main.handleClickAction', 'restore-closed-tab')

  const savedState = await Main.saveState(2)
  assert(savedState.layout.groups.length === 2, `Expected 2 groups, got ${savedState.layout.groups.length}`)
  assert(
    savedState.layout.groups.every((group) => group.tabs.length === 0),
    'Expected both groups to remain empty',
  )
}
