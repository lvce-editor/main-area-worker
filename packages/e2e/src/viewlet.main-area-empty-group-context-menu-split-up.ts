import type { Test } from '@lvce-editor/test-with-playwright'

interface SavedGroup {
  readonly id: number
}

interface SavedLayout {
  readonly activeGroupId?: number
  readonly direction?: number
  readonly groups: readonly SavedGroup[]
}

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

const getLayout = (savedState: unknown, label: string): SavedLayout => {
  assert(!!savedState && typeof savedState === 'object', `${label} must be an object`)
  const { layout } = savedState as { readonly layout?: unknown }
  assert(!!layout && typeof layout === 'object', `${label}.layout must be an object`)
  const { groups } = layout as { readonly groups?: unknown }
  assert(Array.isArray(groups), `${label}.layout.groups must be an array`)
  return layout as SavedLayout
}

export const name = 'viewlet.main-area-empty-group-context-menu-split-up'
export const skip = true

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const beforeState = await Main.saveState(2)
  const beforeLayout = getLayout(beforeState, 'beforeState')
  assert(beforeLayout.groups.length === 0, `Expected no groups, got ${beforeLayout.groups.length}`)

  await Command.execute('Main.handleContextMenu', '', 10, 10)
  await Command.execute('MainArea.splitUp')

  const afterState = await Main.saveState(2)
  const afterLayout = getLayout(afterState, 'afterState')
  assert(afterLayout.direction === 2, `Expected vertical layout, got ${afterLayout.direction}`)
  assert(afterLayout.groups.length === 2, `Expected 2 groups, got ${afterLayout.groups.length}`)
  assert(afterLayout.groups[0].id !== afterLayout.groups[1].id, 'Expected distinct groups after split up')
  assert(afterLayout.activeGroupId === afterLayout.groups[0].id, 'Expected new upper group to become active')
}
