import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('Main.handleContextMenu', '', 10, 10)

  const newTextFileMenuItem = Locator('text=New Text File')
  const openFileMenuItem = Locator('text=Open File')
  const splitUpMenuItem = Locator('text=Split Up')
  const splitDownMenuItem = Locator('text=Split Down')
  const splitLeftMenuItem = Locator('text=Split Left')
  const splitRightMenuItem = Locator('text=Split Right')
  const closeEditorGroupMenuItem = Locator('text=Close Editor Group')
  await expect(newTextFileMenuItem).toBeVisible()
  await expect(openFileMenuItem).toBeVisible()
  await expect(splitUpMenuItem).toBeVisible()
  await expect(splitDownMenuItem).toBeVisible()
  await expect(splitLeftMenuItem).toBeVisible()
  await expect(splitRightMenuItem).toBeVisible()
  await expect(closeEditorGroupMenuItem).toHaveCount(0)
}
