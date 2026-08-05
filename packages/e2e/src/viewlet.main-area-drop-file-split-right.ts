import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-file-split-right'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-split-right-original.txt`
  const dropped = `${tmpDir}/drop-split-right-dropped.txt`
  await FileSystem.setFiles([
    { content: 'original', uri: original },
    { content: 'dropped', uri: dropped },
  ])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const itemId = await FileSystem.registerFileHandle({ kind: 'string', type: 'text/uri-list', value: dropped } as any)

  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', [itemId])

  const groups = Locator('.EditorGroup')
  const leftGroup = groups.nth(0)
  const rightGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  await expect(leftGroup.locator('.MainTab[title$="drop-split-right-original.txt"]')).toBeVisible()
  await expect(rightGroup.locator('.MainTab[title$="drop-split-right-dropped.txt"]')).toBeVisible()
}
