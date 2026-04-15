import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu'

export const test: Test = async ({ Command, expect, FileSystem, Locator }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 101

  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  const savedState = await Command.execute('MainArea.saveState', uid)
  const groupId = savedState.layout.groups[0].id

  await Command.execute('MainArea.handleContextMenu', uid, String(groupId), 10, 10)

  await expect(Locator('text=Open File')).toBeVisible()
  await expect(Locator('text=Split Up')).toBeVisible()
  await expect(Locator('text=Split Down')).toBeVisible()
  await expect(Locator('text=Split Left')).toBeVisible()
  await expect(Locator('text=Split Right')).toBeVisible()
  await expect(Locator('text=New Window')).toBeVisible()
  await expect(Locator('text=Close Editor Group')).toBeVisible()
}
