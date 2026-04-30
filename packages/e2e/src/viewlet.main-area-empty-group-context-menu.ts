import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('Main.handleContextMenu', '', 10, 10)

  await expect(Locator('text=Open File')).toBeVisible()
  await expect(Locator('text=Split Up')).toBeVisible()
  await expect(Locator('text=Split Down')).toBeVisible()
  await expect(Locator('text=Split Left')).toBeVisible()
  await expect(Locator('text=Split Right')).toBeVisible()
  await expect(Locator('text=New Window')).toBeVisible()
  await expect(Locator('text=Close Editor Group')).toHaveCount(0)
}
