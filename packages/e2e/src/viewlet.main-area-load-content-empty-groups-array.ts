import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-load-content-empty-groups-array'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 120
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.loadContent', uid, {
    layout: {
      activeGroupId: undefined,
      direction: 1,
      groups: [],
    },
  })

  const savedState = await Command.execute('MainArea.saveState', uid)

  assert(savedState.layout.groups.length === 0, `Expected empty groups array to restore, got ${savedState.layout.groups.length} groups`)
}
