import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-empty-groups-hides-last-close-button'

interface SavedGroup {
  readonly id: number
}

interface SavedLayout {
  readonly groups: readonly SavedGroup[]
}

const getLayout = (savedState: unknown): SavedLayout => {
  return (savedState as { readonly layout: SavedLayout }).layout
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

  const savedState = await Main.saveState(2)
  const layout = getLayout(savedState)
  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(layout.groups[0].id))
  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(layout.groups[1].id))

  await expect(editorGroups).toHaveCount(1)
  await expect(closeButtons).toHaveCount(0)
}
