import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-new-window'
export const skip = true

export const test: Test = async ({ BaseUrl, Command, expect, FileSystem, Locator, Open }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 108
  const baseUrl = BaseUrl.getBaseUrl()

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  const savedState = await Command.execute('MainArea.saveState', uid)
  const groupId = savedState.layout.groups[0].id

  await Open.enableMemoryOpener()

  await Command.execute('MainArea.handleContextMenu', uid, String(groupId), 10, 10)

  const newWindowMenuItem = Locator('text=New Window')
  await expect(newWindowMenuItem).toBeVisible()
  await newWindowMenuItem.click()

  await Open.shouldHaveUrl(baseUrl)
}
