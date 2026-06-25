import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-resize-returns-editor-resize-commands'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 116
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/resize-left.ts`
  const file2 = `${tmpDir}/resize-right.ts`

  await FileSystem.writeFile(file1, 'left')
  await FileSystem.writeFile(file2, 'right')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, file1)
  await Command.execute('MainArea.splitRight', uid)
  await Command.execute('MainArea.openUri', uid, file2)

  const commands = await Command.execute('MainArea.resize', uid, { height: 700, width: 900, x: 10, y: 20 })

  assert(commands.length > 0, 'Expected resize to return editor resize commands')
}
