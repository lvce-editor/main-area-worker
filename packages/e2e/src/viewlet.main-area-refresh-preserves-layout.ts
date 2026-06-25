import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-refresh-preserves-layout'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 130
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/refresh-1.ts`
  const file2 = `${tmpDir}/refresh-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)
  await Command.execute('MainArea.openUri', uid, file2)

  const before = await Command.execute('MainArea.saveState', uid)
  await Command.execute('MainArea.refresh', uid)
  const after = await Command.execute('MainArea.saveState', uid)

  assert(JSON.stringify(after.layout) === JSON.stringify(before.layout), 'Expected refresh to preserve layout state')
}
