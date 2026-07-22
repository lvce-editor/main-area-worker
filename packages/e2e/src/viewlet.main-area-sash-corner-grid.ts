import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-sash-corner-grid'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 9010
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.setEditorLayoutGrid', uid)
  await Command.execute('MainArea.handleSashCornerPointerDown', uid, 400, 300)
  await Command.execute('MainArea.handleSashCornerPointerMove', uid, 320, 240)
  await Command.execute('MainArea.handleSashCornerPointerUp', uid, 320, 240)

  const savedState = await Command.execute('MainArea.saveState', uid)
  const sizes = savedState.layout.groups.map((group) => group.size)
  assert(JSON.stringify(sizes) === JSON.stringify([16, 24, 24, 36]), `Expected resized grid sizes, got ${JSON.stringify(sizes)}`)
}
