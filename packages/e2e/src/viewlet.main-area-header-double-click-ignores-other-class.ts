import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-header-double-click-ignores-other-class'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 131
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/header-ignore.ts`

  await FileSystem.writeFile(file1, 'existing')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)
  await Command.execute('MainArea.handleHeaderDoubleClick', uid, 'NotMainTabs', '0')

  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups[0].tabs.length === 1, `Expected unrelated double click to be ignored, got ${savedState.layout.groups[0].tabs.length} tabs`)
}
