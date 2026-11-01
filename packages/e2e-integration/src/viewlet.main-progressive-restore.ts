import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-progressive-restore'

export const test: Test = async ({ Command, Editor, expect, Explorer, FileSystem, Locator, Main, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const restoredFile = `${tmpDir}/restored.js`
  const secondRestoredFile = `${tmpDir}/second-restored.js`
  const explorerFile = `${tmpDir}/a-explorer.js`
  const quickPickFile = `${tmpDir}/b-quickpick.js`
  await FileSystem.setFiles([
    { content: 'restored file', uri: restoredFile },
    { content: 'second restored file', uri: secondRestoredFile },
    { content: 'explorer file', uri: explorerFile },
    { content: 'quickpick file', uri: quickPickFile },
  ])
  await Workspace.setUri(tmpDir)
  const savedState = {
    layout: {
      activeGroupId: 101,
      direction: 1,
      groups: [
        {
          activeTabId: 102,
          direction: 1,
          id: 101,
          isEmpty: false,
          isFocused: true,
          size: 50,
          tabs: [{ editorUid: -1, icon: '', id: 102, isDirty: false, isPreview: false, title: 'restored.js', uri: restoredFile }],
        },
        {
          activeTabId: 202,
          direction: 1,
          id: 201,
          isEmpty: false,
          isFocused: false,
          size: 50,
          tabs: [{ editorUid: -1, icon: '', id: 202, isDirty: false, isPreview: false, title: 'second-restored.js', uri: secondRestoredFile }],
        },
      ],
    },
  }

  // Exercise the shell boundary with content deliberately not started yet.
  await Command.execute('Main.loadContentShell', savedState)
  const restoredTab = Locator('.MainTab[title$="/restored.js"]')
  await expect(restoredTab).toBeVisible()
  const loading = Locator('.EditorContent--loading')
  await expect(loading).toHaveCount(2)
  await expect(loading.nth(0)).toHaveText('Loading...')
  await expect(loading.nth(1)).toHaveText('Loading...')

  await Explorer.handleClick(0)
  await Editor.shouldHaveText('explorer file')
  await QuickPick.open()
  await QuickPick.setValue('b-quickpick.js')
  await QuickPick.selectItem('b-quickpick.js')
  await Editor.shouldHaveText('quickpick file')
  await Command.execute('Main.loadContentLater')
  const selectedTab = Locator('.MainTabSelected[title$="b-quickpick.js"]')
  await expect(selectedTab).toBeVisible()
  await Editor.shouldHaveText('quickpick file')
  await Main.selectTab(0, 0)
  await Editor.shouldHaveText('restored file')
  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(2)
  await expect(editors.nth(1)).toHaveText('second restored file')
}
