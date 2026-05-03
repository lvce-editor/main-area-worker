import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-new-window'
export const skip = true

export const test: Test = async ({ BaseUrl, Command, FileSystem, Open, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const baseUrl = BaseUrl.getBaseUrl()

  await Workspace.setPath(tmpDir)

  await Open.enableMemoryOpener()

  await Command.execute('Main.handleContextMenu', '', 10, 10)
  await Command.execute('MainArea.newWindow')

  await Open.shouldHaveUrl(baseUrl)
}
