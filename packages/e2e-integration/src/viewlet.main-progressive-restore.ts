import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-progressive-restore'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const restoredFile = `${tmpDir}/restored.txt`
  const newFile = `${tmpDir}/opened-during-restore.txt`
  await FileSystem.setFiles([
    { content: 'restored file', uri: restoredFile },
    { content: 'new file', uri: newFile },
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
          size: 100,
          tabs: [{ editorUid: -1, icon: '', id: 102, isDirty: false, isPreview: false, title: 'restored.txt', uri: restoredFile }],
        },
      ],
    },
  }

  // Exercise the shell boundary with content deliberately not started yet.
  await Command.execute('Main.loadContentShell', savedState)
  const restoredTab = Locator('.MainTab[title$="restored.txt"]')
  await expect(restoredTab).toBeVisible()
  const loading = Locator('.EditorContentLoading')
  await expect(loading).toHaveText('Loading...')

  await Main.openUri(newFile)
  await Editor.shouldHaveText('new file')
  await Command.execute('Main.loadContentLater')
  const selectedTab = Locator('.MainTabSelected[title$="opened-during-restore.txt"]')
  await expect(selectedTab).toBeVisible()
  await Editor.shouldHaveText('new file')
  await Main.selectTab(0, 0)
  await Editor.shouldHaveText('restored file')
}
