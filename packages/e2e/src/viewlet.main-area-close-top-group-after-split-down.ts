import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-top-group-after-split-down'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const fileTop = `${tmpDir}/file-top.ts`
  const fileBottom = `${tmpDir}/file-bottom.ts`

  await FileSystem.writeFile(fileTop, 'content-top')
  await FileSystem.writeFile(fileBottom, 'content-bottom')

  await Main.openUri(fileTop)
  await Command.execute('Main.splitDown')

  const savedState1 = await Command.execute('MainArea.saveState', 2)
  assert(savedState1.layout.groups.length === 2, `Expected 2 groups, got ${savedState1.layout.groups.length}`)

  const topGroupId = savedState1.layout.groups[0].id

  await Main.openUri(fileBottom)

  await Command.execute('MainArea.handleClickAction', 2, 'close-group', String(topGroupId))

  const savedState2 = await Command.execute('MainArea.saveState', 2)
  assert(savedState2.layout.groups.length === 1, `Expected 1 group, got ${savedState2.layout.groups.length}`)
  assert(savedState2.layout.groups[0].tabs.length === 1, `Expected 1 tab, got ${savedState2.layout.groups[0].tabs.length}`)
  assert(savedState2.layout.groups[0].tabs[0].path === fileBottom, `Expected remaining tab to be ${fileBottom}`)
}
