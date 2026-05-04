import type { Test } from '@lvce-editor/test-with-playwright'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const name = 'viewlet.main-area-empty-group-context-menu-new-text-file'

export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const beforeState = await Main.saveState(2)
  assert(beforeState.layout.groups.length === 0, `Expected no groups, got ${beforeState.layout.groups.length}`)

  await Command.execute('Main.handleContextMenu', '', 10, 10)

  const newTextFileMenuItem = Locator('text=New Text File')
  await expect(newTextFileMenuItem).toBeVisible()
  await newTextFileMenuItem.click()

  const afterState = await Main.saveState(2)
  assert(afterState.layout.groups.length === 1, `Expected 1 group, got ${afterState.layout.groups.length}`)
  assert(afterState.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${afterState.layout.groups[0].tabs.length}`)
  assert(afterState.layout.groups[0].tabs[0].title === 'Untitled', `Expected Untitled tab, got ${afterState.layout.groups[0].tabs[0].title}`)
  assert(afterState.layout.groups[0].tabs[0].uri === 'untitled:///1', `Expected untitled uri, got ${afterState.layout.groups[0].tabs[0].uri}`)
  assert(afterState.layout.groups[0].activeTabId === afterState.layout.groups[0].tabs[0].id, 'Expected new untitled tab to be active')

  const tab = Locator('.MainTab[title="Untitled"]')
  await expect(tab).toBeVisible()
}
