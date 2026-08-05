import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-file-center-no-split'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-center-original.txt`
  const dropped = `${tmpDir}/drop-center-dropped.txt`
  await FileSystem.setFiles([
    { content: 'original', uri: original },
    { content: 'dropped', uri: dropped },
  ])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const itemId = await FileSystem.registerFileHandle({ kind: 'string', type: 'text/uri-list', value: dropped } as any)

  await Command.execute('Main.handleDragOver', 500, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', [itemId])

  const groups = Locator('.EditorGroup')
  const group = groups.nth(0)
  await expect(groups).toHaveCount(1)
  await expect(group.locator('.MainTab[title$="drop-center-original.txt"]')).toBeVisible()
  await expect(group.locator('.MainTab[title$="drop-center-dropped.txt"]')).toBeVisible()
}
