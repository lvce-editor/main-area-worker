import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-explorer-create-json'

export const test: Test = async ({ Command, Editor, expect, Explorer, FileSystem, KeyBoard, Locator, Settings, Workspace }) => {
  await Settings.update({ 'editor.diagnostics': true, 'workbench.editor.showTabsWhileLoading': false })
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showPanel', 'Problems')
  await Explorer.newFile()
  await Explorer.updateEditingValue('b.json')
  await KeyBoard.press('Enter')

  await expect(Locator('.Explorer input')).toBeHidden()
  await expect(Locator('.Editor')).toBeVisible()
  await expect(Locator('.EditorInput textarea')).toBeFocused()
  await Command.execute('Editor.waitForDiagnostics')
  await expect(Locator('.Problems')).toContainText('Expected a JSON value.')
  await Editor.type('{}')
  await Editor.shouldHaveText('{}')
  await Command.execute('Editor.waitForDiagnostics')
  await Editor.shouldHaveDiagnostics([])
}
