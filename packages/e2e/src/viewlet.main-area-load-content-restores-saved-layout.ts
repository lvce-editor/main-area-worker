import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-load-content-restores-saved-layout'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const originalUid = 104
  const restoredUid = 105
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/restore-layout-left.ts`
  const file2 = `${tmpDir}/restore-layout-right.ts`

  await FileSystem.writeFile(file1, 'left')
  await FileSystem.writeFile(file2, 'right')

  await Command.execute('MainArea.create', originalUid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', originalUid, file1)
  await Command.execute('MainArea.splitRight', originalUid)
  await Command.execute('MainArea.openUri', originalUid, file2)
  await Command.execute('MainArea.selectTab', originalUid, 1, 0)

  const savedLayout = await Command.execute('MainArea.saveState', originalUid)

  await Command.execute('MainArea.create', restoredUid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.loadContent', restoredUid, savedLayout)

  const restoredState = await Command.execute('MainArea.saveState', restoredUid)
  const restoredUris = restoredState.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.uri))

  assert(restoredState.layout.groups.length === 2, `Expected 2 restored groups, got ${restoredState.layout.groups.length}`)
  assert(JSON.stringify(restoredUris) === JSON.stringify([file1, file2]), `Expected restored uris ${file1},${file2}; got ${restoredUris.join(',')}`)
  assert(restoredState.layout.activeGroupId === savedLayout.layout.activeGroupId, 'Expected active group id to be restored')
}
