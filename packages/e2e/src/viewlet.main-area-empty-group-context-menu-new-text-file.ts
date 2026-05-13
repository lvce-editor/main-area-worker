import type { Test } from '@lvce-editor/test-with-playwright'

interface SavedTab {
  readonly id: number
  readonly title?: string
  readonly uri?: string
}

interface SavedGroup {
  readonly activeTabId?: number
  readonly tabs: readonly SavedTab[]
}

interface SavedLayout {
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

export const name = 'viewlet.main-area-empty-group-context-menu-new-text-file'

export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const beforeState = await Main.saveState(2)
  const beforeLayout = getLayout(beforeState, 'beforeState')
  assert(beforeLayout.groups.length === 0, `Expected no groups, got ${beforeLayout.groups.length}`)

  await Command.execute('Main.handleContextMenu', '', 10, 10)

  const newTextFileMenuItem = Locator('text=New Text File')
  await expect(newTextFileMenuItem).toBeVisible()
  await Command.execute('MainArea.newFile')

  const afterState = await Main.saveState(2)
  const afterLayout = getLayout(afterState, 'afterState')
  assert(afterLayout.groups.length === 1, `Expected 1 group, got ${afterLayout.groups.length}`)
  assert(afterLayout.groups[0].tabs.length === 1, `Expected 1 tab, got ${afterLayout.groups[0].tabs.length}`)
  assert(afterLayout.groups[0].tabs[0].title === 'Untitled', `Expected Untitled tab, got ${afterLayout.groups[0].tabs[0].title}`)
  assert(afterLayout.groups[0].tabs[0].uri === 'untitled:///1', `Expected untitled uri, got ${afterLayout.groups[0].tabs[0].uri}`)
  assert(afterLayout.groups[0].activeTabId === afterLayout.groups[0].tabs[0].id, 'Expected new untitled tab to be active')

  const tab = Locator('.MainTab[title="Untitled"]')
  await expect(tab).toBeVisible()
}
