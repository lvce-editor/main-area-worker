import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-icon-theme-change-preserves-tabs'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 117
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/icon-theme.ts`
  const file2 = `${tmpDir}/icon-theme.md`

  await FileSystem.writeFile(file1, 'ts')
  await FileSystem.writeFile(file2, 'md')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)
  await Command.execute('MainArea.openUri', uid, file2)
  await Command.execute('MainArea.handleIconThemeChange', uid)

  const savedState = await Command.execute('MainArea.saveState', uid)
  const uris = savedState.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.uri))

  assert(JSON.stringify(uris) === JSON.stringify([file1, file2]), `Expected tabs to be preserved, got ${uris.join(',')}`)
}
