import type { Test } from '@lvce-editor/test-with-playwright'
import { assertSavedStateLayout } from './assertSavedStateLayout.ts'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const name = 'viewlet.main-area-empty-group-context-menu-split-left'
export const skip = true

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const beforeState = await Main.saveState(2)
  const beforeLayout = assertSavedStateLayout(beforeState, 'beforeState')
  assert(beforeLayout.groups.length === 0, `Expected no groups, got ${beforeLayout.groups.length}`)

  await Command.execute('Main.handleContextMenu', '', 10, 10)
  await Command.execute('MainArea.splitLeft')

  const afterState = await Main.saveState(2)
  const afterLayout = assertSavedStateLayout(afterState, 'afterState')
  assert(afterLayout.direction === 1, `Expected horizontal layout, got ${afterLayout.direction}`)
  assert(afterLayout.groups.length === 2, `Expected 2 groups, got ${afterLayout.groups.length}`)
  assert(afterLayout.groups[0].id !== afterLayout.groups[1].id, 'Expected distinct groups after split left')
  assert(afterLayout.activeGroupId === afterLayout.groups[0].id, 'Expected new left group to become active')
}
