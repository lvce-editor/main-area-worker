import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-open-file'
export const skip = true

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uid = 102
  const testFile = `${tmpDir}/context-menu-open-file.ts`

  await FileSystem.writeFile(testFile, 'export const value = 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('MainArea.create', uid, '', 0, 0, 800, 600, 0, tmpDir)

  const savedState = await Command.execute('MainArea.saveState', uid)
  const groupId = savedState.layout.groups[0].id

  await Command.execute('MainArea.handleContextMenu', uid, String(groupId), 10, 10)

  const openFileMenuItem = Locator('text=Open File').first()
  await expect(openFileMenuItem).toBeVisible()
  await openFileMenuItem.click()

  const quickPickItem = Locator('.QuickPickItemLabel').first()
  await expect(quickPickItem).toBeVisible()
  await expect(quickPickItem).toContainText('context-menu-open-file.ts')
}
