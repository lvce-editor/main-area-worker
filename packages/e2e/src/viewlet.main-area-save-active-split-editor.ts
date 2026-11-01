import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save-active-split-editor'

const ctrlS = 2095

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, TitleBarMenuBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const leftUri = `${tmpDir}/left.txt`
  const rightUri = `${tmpDir}/right.txt`
  const leftTab = Locator('.MainTab[title$="left.txt"]')
  const rightTab = Locator('.MainTab[title$="right.txt"]')
  const leftModifiedTab = Locator('.MainTab[title$="left.txt"].MainTabModified')
  const rightModifiedTab = Locator('.MainTab[title$="right.txt"].MainTabModified')
  await FileSystem.setFiles([
    { content: 'left', uri: leftUri },
    { content: 'right', uri: rightUri },
  ])
  await Workspace.setUri(tmpDir)
  await Main.openUri(leftUri)
  await Editor.setCursor(0, 0)
  await Editor.type('changed ')
  await expect(leftTab).toHaveClass('MainTabModified')
  await Main.splitRight()
  await Main.openUri(rightUri)

  const editorGroups = Locator('.EditorGroup')
  const leftGroup = editorGroups.nth(0)
  const rightGroup = editorGroups.nth(1)
  const leftEditorContent = leftGroup.locator('.Editor')
  const rightEditorContent = rightGroup.locator('.Editor')
  const leftEditor = leftGroup.locator('[name="editor"]')
  const rightEditor = rightGroup.locator('[name="editor"]')
  // eslint-disable-next-line @typescript-eslint/no-deprecated, e2e/no-direct-click -- Exercise the pane mouse event before focusing its DOM input.
  await rightEditor.click()
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Focus the actual DOM input.
  await rightEditor.type('')
  await expect(rightEditor).toBeFocused()
  await Editor.setCursor(0, 0)
  await Editor.type('changed ')
  await expect(leftEditorContent).toHaveText('changed left')
  await expect(rightEditorContent).toHaveText('changed right')
  await expect(rightTab).toHaveClass('MainTabModified')
  // eslint-disable-next-line @typescript-eslint/no-deprecated, e2e/no-direct-click -- Exercise the pane mouse event before focusing its DOM input.
  await leftEditor.click()
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Focus the actual DOM input.
  await leftEditor.type('')
  await expect(leftEditor).toBeFocused()
  // eslint-disable-next-line @typescript-eslint/no-deprecated, e2e/no-direct-click -- Exercise the pane mouse event before focusing its DOM input.
  await rightEditor.click()
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Focus the actual DOM input.
  await rightEditor.type('')
  await expect(rightEditor).toBeFocused()

  await expect(leftTab).toHaveClass('MainTabModified')
  await expect(rightTab).toHaveClass('MainTabModified')

  await Command.execute('KeyBindings.handleKeyBinding', ctrlS)

  await FileSystem.shouldHaveFile(leftUri, 'left')
  await FileSystem.shouldHaveFile(rightUri, 'changed right')
  await expect(leftTab).toHaveClass('MainTabModified')
  await expect(rightModifiedTab).toHaveCount(0)

  await Editor.setCursor(0, 0)
  await Editor.type('unsaved ')
  await expect(rightEditorContent).toHaveText('unsaved changed right')
  await expect(rightTab).toHaveClass('MainTabModified')

  // eslint-disable-next-line @typescript-eslint/no-deprecated, e2e/no-direct-click -- Exercise the pane mouse event before focusing its DOM input.
  await leftEditor.click()
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Focus the actual DOM input.
  await leftEditor.type('')
  await expect(leftEditor).toBeFocused()
  await TitleBarMenuBar.toggleIndex(0)
  const saveMenuItem = Locator('#Menu-0 .MenuItem', { hasText: 'Save' })
  await expect(saveMenuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 0, 7)

  await FileSystem.shouldHaveFile(leftUri, 'changed left')
  await FileSystem.shouldHaveFile(rightUri, 'changed right')
  await expect(leftModifiedTab).toHaveCount(0)
  await expect(rightTab).toHaveClass('MainTabModified')
}
