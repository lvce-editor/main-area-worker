import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-editor-group-keeps-other-groups'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 126
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/group-keep-left.ts`
  const file2 = `${tmpDir}/group-close-right.ts`

  await FileSystem.writeFile(file1, 'left')
  await FileSystem.writeFile(file2, 'right')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)
  await Command.execute('MainArea.splitRight', uid)
  await Command.execute('MainArea.openUri', uid, file2)

  const before = await Command.execute('MainArea.saveState', uid)
  const rightGroupId = before.layout.groups[1].id

  await Command.execute('MainArea.closeEditorGroup', uid, rightGroupId)

  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 1, `Expected 1 group after close group, got ${savedState.layout.groups.length}`)
  assert(savedState.layout.groups[0].tabs[0].uri === file1, `Expected left file to remain, got ${savedState.layout.groups[0].tabs[0].uri}`)
}
