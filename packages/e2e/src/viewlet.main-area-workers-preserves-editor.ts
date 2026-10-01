import type { Test } from '@lvce-editor/test-with-playwright'

interface RestoredState {
  layout: {
    activeGroupId: number
    groups: { activeTabId: number; id: number; tabs: { editorUid: number; id: number }[] }[]
  }
}

export const name = 'viewlet.main-area-workers-preserves-editor'

export const test: Test = async ({ Command, ComponentState, Editor, expect, FileSystem, Locator, Main, Settings }) => {
  await Settings.update({ 'editor.fontFamily': 'monospace' })
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/original.ts`
  await FileSystem.writeFile(uri, 'const value = 1\n')
  await Main.openUri(uri)
  await Editor.shouldHaveText('const value = 1\n')
  const saved = await ComponentState.getState<RestoredState>(2)
  const group = saved.layout.groups[0]
  const tab = group?.tabs[0]
  if (!group || !tab) {
    throw new Error('Expected the original file tab')
  }
  // Simulate a saved session overlapping a fresh renderer's next ID range.
  const nextId = tab.editorUid + 1
  group.id = nextId
  group.activeTabId = nextId + 1
  saved.layout.activeGroupId = nextId
  tab.id = nextId + 1
  await Main.closeActiveEditor()
  await Command.execute('Viewlet.executeViewletCommand', 2, 'loadContent', saved)
  await Main.openUri(uri)
  await Editor.shouldHaveText('const value = 1\n')
  await Editor.setCursor(0, 0)
  await Editor.type('// unsaved\n')

  const table = Locator('.WorkersViewTable')
  const tabs = Locator('.MainTab')
  const selectedTabs = Locator('.MainTab[aria-selected="true"]')
  const originalTab = Locator('.MainTab[title$="original.ts"]')
  for (let i = 0; i < 3; i++) {
    await Main.openUri('workers:///1')
    await expect(table).toBeVisible()
    await expect(tabs).toHaveCount(2)
    await expect(selectedTabs).toHaveCount(1)
    await expect(originalTab).toHaveCount(1)
    await Main.openUri(uri)
    await Editor.shouldHaveText('// unsaved\nconst value = 1\n')
  }
  await Main.openUri('workers:///1')
  await Main.closeActiveEditor()
  await expect(tabs).toHaveCount(1)
  await Editor.shouldHaveText('// unsaved\nconst value = 1\n')
}
