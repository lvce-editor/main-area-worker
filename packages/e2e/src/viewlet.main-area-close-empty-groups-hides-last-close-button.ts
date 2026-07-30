import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-empty-groups-hides-last-close-button'

const getFirstGroupId = (state: unknown): number => {
  const groupId = (state as { readonly layout?: { readonly groups?: readonly { readonly id?: number }[] } }).layout?.groups?.[0]?.id
  if (groupId === undefined) {
    throw new Error('Expected the main area state to have at least one group')
  }
  return groupId
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Main.splitRight()
  await Main.splitRight()

  const editorGroups = Locator('.EditorGroup')
  const closeButtons = Locator('.EmptyGroupCloseButton')
  await expect(editorGroups).toHaveCount(3)
  await expect(closeButtons).toHaveCount(3)

  const stateWithThreeGroups = await Main.saveState(2)
  await Command.execute('MainArea.closeEditorGroup', getFirstGroupId(stateWithThreeGroups))
  await expect(editorGroups).toHaveCount(2)
  await expect(closeButtons).toHaveCount(2)
  const stateWithTwoGroups = await Main.saveState(2)
  await Command.execute('MainArea.closeEditorGroup', getFirstGroupId(stateWithTwoGroups))

  await expect(editorGroups).toHaveCount(1)
  await expect(closeButtons).toHaveCount(0)
}
