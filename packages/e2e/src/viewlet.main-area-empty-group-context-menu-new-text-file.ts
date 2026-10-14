import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-empty-group-context-menu-new-text-file'

export const test: Test = async ({ Command, ContextMenu, Editor, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setUri(tmpDir)

  await Command.execute('Main.handleContextMenu', '', 10, 10)

  const newTextFileMenuItem = Locator('text=New Text File')
  await expect(newTextFileMenuItem).toBeVisible()
  await ContextMenu.selectItem('New Text File')

  const untitledTab = Locator('.MainTab[title^="untitled:///"]')
  await expect(untitledTab).toHaveClass('MainTabSelected')

  const editor = Locator('[name="editor"]')
  await expect(editor).toBeFocused()
  await Editor.type('new file')
  await Editor.shouldHaveText('new file')
}
