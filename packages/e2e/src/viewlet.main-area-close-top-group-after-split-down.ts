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

export const name = 'viewlet.main-area-close-top-group-after-split-down'

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
  const fileTop = `${tmpDir}/file-top.ts`
  const fileBottom = `${tmpDir}/file-bottom.ts`

  await FileSystem.setFiles([
    { content: 'content-top', uri: fileTop },
    { content: 'content-bottom', uri: fileBottom },
  ])

  await Main.openUri(fileTop)
  await Main.splitDown()

  const savedState1 = await Main.saveState(2)
  const layout1 = getLayout(savedState1, 'savedState1')
  assert(layout1.groups.length === 2, `Expected 2 groups, got ${layout1.groups.length}`)

  const topGroupId = layout1.groups[0].id

  await Main.openUri(fileBottom)

  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(topGroupId))

  const savedState2 = await Main.saveState(2)
  const layout2 = getLayout(savedState2, 'savedState2')
  assert(layout2.groups.length === 1, `Expected 1 group, got ${layout2.groups.length}`)
  assert(layout2.groups[0].tabs.length === 1, `Expected 1 tab, got ${layout2.groups[0].tabs.length}`)
  assert(layout2.groups[0].tabs[0].path === fileBottom, `Expected remaining tab to be ${fileBottom}`)
}
