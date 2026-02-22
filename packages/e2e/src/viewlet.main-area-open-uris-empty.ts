import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-empty'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 100

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUris', uid, [])

  const savedState = await Command.execute('MainArea.saveState', uid)
  const groupCount = savedState.layout.groups.length
  const tabCount = savedState.layout.groups.reduce((sum: number, group: any) => sum + group.tabs.length, 0)

  assert(groupCount === 0, `Expected 0 groups after opening empty uri array, got ${groupCount}`)
  assert(tabCount === 0, `Expected 0 tabs after opening empty uri array, got ${tabCount}`)
}
