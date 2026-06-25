import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-input-diff-deduplicates'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const left = `file://${tmpDir}/open-input-left.ts`
  const right = `file://${tmpDir}/open-input-right.ts`
  const options = {
    editorInput: {
      type: 'diff-editor',
      uriLeft: left,
      uriRight: right,
    },
    focu: false,
    preview: false,
  }

  await Command.execute('Main.openInput', options)
  await Command.execute('Main.openInput', options)

  await expect(Locator('.MainTab')).toHaveCount(1)
}
