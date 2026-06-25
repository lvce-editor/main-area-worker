import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-input-extension-detail-deduplicates'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const options = {
    editorInput: {
      extensionId: 'sample.extension',
      type: 'extension-detail-view',
    },
    focu: false,
    preview: false,
  }

  await Command.execute('Main.openInput', options)
  await Command.execute('Main.openInput', options)

  await expect(Locator('.MainTab[title$="sample.extension"]')).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
