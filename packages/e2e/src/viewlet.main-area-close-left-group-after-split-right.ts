import type { Test } from '@lvce-editor/test-with-playwright'
import { assertSavedStateLayout } from './assertSavedStateLayout.ts'

export const name = 'viewlet.main-area-close-left-group-after-split-right'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
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
  const layout1 = assertSavedStateLayout(savedState1, 'savedState1')
  assert(layout1.groups.length === 2, `Expected 2 groups, got ${layout1.groups.length}`)

  const leftGroupId = layout1.groups[0].id

  await Main.openUri(fileRight)

  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(leftGroupId))

  const savedState2 = await Main.saveState(2)
  const layout2 = assertSavedStateLayout(savedState2, 'savedState2')
  assert(layout2.groups.length === 1, `Expected 1 group, got ${layout2.groups.length}`)
  assert(layout2.groups[0].tabs.length === 1, `Expected 1 tab, got ${layout2.groups[0].tabs.length}`)
  assert(layout2.groups[0].tabs[0].path === fileRight, `Expected remaining tab to be ${fileRight}`)
}
