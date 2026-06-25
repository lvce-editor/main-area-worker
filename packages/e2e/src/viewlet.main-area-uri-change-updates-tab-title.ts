import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-uri-change-updates-tab-title'
export const skip = true

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const uid = 112
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const oldUri = `${tmpDir}/before-rename.ts`
  const newUri = `${tmpDir}/after-rename.ts`

  await FileSystem.writeFile(oldUri, 'before')
  await FileSystem.writeFile(newUri, 'after')

  await Command.execute('MainArea.create', uid, tmpDir, 0, 0, 800, 600, 0, tmpDir)
  await Command.execute('MainArea.openUri', uid, oldUri)
  await Command.execute('MainArea.handleUriChange', uid, oldUri, newUri)

  const savedState = await Command.execute('MainArea.saveState', uid)
  const tab = savedState.layout.groups[0].tabs[0]

  assert(tab.uri === newUri, `Expected updated uri ${newUri}, got ${tab.uri}`)
  assert(tab.title === 'after-rename.ts', `Expected after-rename.ts, got ${tab.title}`)
}
