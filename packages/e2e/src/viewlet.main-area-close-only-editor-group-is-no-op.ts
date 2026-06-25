import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-only-editor-group-is-no-op'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 127
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/single-group.ts`

  await FileSystem.writeFile(file1, 'single')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)

  const before = await Command.execute('MainArea.saveState', uid)
  await Command.execute('MainArea.closeEditorGroup', uid, before.layout.groups[0].id)

  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 1, `Expected only group close to be ignored, got ${savedState.layout.groups.length} groups`)
  assert(savedState.layout.groups[0].tabs[0].uri === file1, `Expected tab to remain, got ${savedState.layout.groups[0].tabs[0].uri}`)
}
