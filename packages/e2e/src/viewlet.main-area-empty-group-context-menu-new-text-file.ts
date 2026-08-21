import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-new-text-file'

export const test: Test = async ({ Command, ContextMenu, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('Main.handleContextMenu', '', 10, 10)
  await new Promise((resolve) => setTimeout(resolve, 100))

  const newTextFileMenuItem = Locator('text=New Text File')
  await expect(newTextFileMenuItem).toBeVisible()
  await ContextMenu.selectItem('New Text File')

  const untitledTab = Locator('.MainTab[title^="untitled:///"]')
  await expect(untitledTab).toHaveClass('MainTabSelected')
}
