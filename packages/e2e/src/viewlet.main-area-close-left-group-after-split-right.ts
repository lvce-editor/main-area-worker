import type { Test } from '@lvce-editor/test-with-playwright'

interface SavedTab {
  readonly id: number
  readonly path?: string
}

interface SavedGroup {
  readonly id: number
  readonly tabs: readonly SavedTab[]
}

interface SavedLayout {
  readonly groups: readonly SavedGroup[]
}

export const name = 'viewlet.main-area-close-left-group-after-split-right'

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

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const fileLeft = `${tmpDir}/file-left.ts`
  const fileRight = `${tmpDir}/file-right.ts`

  await FileSystem.writeFile(fileLeft, 'content-left')
  await FileSystem.writeFile(fileRight, 'content-right')

  await Main.openUri(fileLeft)
  await Main.splitRight()

  const savedState1 = await Main.saveState(2)
  const layout1 = getLayout(savedState1, 'savedState1')
  assert(layout1.groups.length === 2, `Expected 2 groups, got ${layout1.groups.length}`)

  const leftGroupId = layout1.groups[0].id

  await Main.openUri(fileRight)

  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(leftGroupId))

  const savedState2 = await Main.saveState(2)
  const layout2 = getLayout(savedState2, 'savedState2')
  assert(layout2.groups.length === 1, `Expected 1 group, got ${layout2.groups.length}`)
  assert(layout2.groups[0].tabs.length === 1, `Expected 1 tab, got ${layout2.groups[0].tabs.length}`)
  assert(layout2.groups[0].tabs[0].path === fileRight, `Expected remaining tab to be ${fileRight}`)
}
