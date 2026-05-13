import type { Test } from '@lvce-editor/test-with-playwright'
import { assertSavedStateLayout } from './assertSavedStateLayout.js'

export const name = 'viewlet.main-area-close-top-group-after-split-down'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const fileTop = `${tmpDir}/file-top.ts`
  const fileBottom = `${tmpDir}/file-bottom.ts`

  await FileSystem.writeFile(fileTop, 'content-top')
  await FileSystem.writeFile(fileBottom, 'content-bottom')

  await Main.openUri(fileTop)
  await Main.splitDown()

  const savedState1 = await Main.saveState(2)
  const layout1 = assertSavedStateLayout(savedState1, 'savedState1')
  assert(layout1.groups.length === 2, `Expected 2 groups, got ${layout1.groups.length}`)

  const topGroupId = layout1.groups[0].id

  await Main.openUri(fileBottom)

  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(topGroupId))

  const savedState2 = await Main.saveState(2)
  const layout2 = assertSavedStateLayout(savedState2, 'savedState2')
  assert(layout2.groups.length === 1, `Expected 1 group, got ${layout2.groups.length}`)
  assert(layout2.groups[0].tabs.length === 1, `Expected 1 tab, got ${layout2.groups[0].tabs.length}`)
  assert(layout2.groups[0].tabs[0].path === fileBottom, `Expected remaining tab to be ${fileBottom}`)
}
