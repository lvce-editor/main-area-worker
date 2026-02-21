import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-left-group-after-split-right'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const fileLeft = `${tmpDir}/file-left.ts`
  const fileRight = `${tmpDir}/file-right.ts`

  await FileSystem.writeFile(fileLeft, 'content-left')
  await FileSystem.writeFile(fileRight, 'content-right')

  await Main.openUri(fileLeft)
  await Main.splitRight()

  const savedState1 = await Command.execute('MainArea.saveState', 2)
  assert(savedState1.layout.groups.length === 2, `Expected 2 groups, got ${savedState1.layout.groups.length}`)

  const leftGroupId = savedState1.layout.groups[0].id

  await Main.openUri(fileRight)

  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(leftGroupId))

  const savedState2 = await Command.execute('MainArea.saveState', 2)
  assert(savedState2.layout.groups.length === 1, `Expected 1 group, got ${savedState2.layout.groups.length}`)
  assert(savedState2.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState2.layout.groups[0].tabs.length}`)
  assert(savedState2.layout.groups[0].tabs[0].path === fileRight, `Expected remaining tab to be ${fileRight}`)
}
