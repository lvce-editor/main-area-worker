import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-file-split-down'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-split-down-original.txt`
  const dropped = `${tmpDir}/drop-split-down-dropped.txt`
  await FileSystem.setFiles([
    { content: 'original', uri: original },
    { content: 'dropped', uri: dropped },
  ])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const itemId = await FileSystem.registerFileHandle({ kind: 'string', type: 'text/uri-list', value: dropped } as any)

  await Command.execute('Main.handleDragOver', 500, 10_000)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', [itemId])

  const groups = Locator('.EditorGroup')
  const topGroup = groups.nth(0)
  const bottomGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  await expect(topGroup.locator('.MainTab[title$="drop-split-down-original.txt"]')).toBeVisible()
  await expect(bottomGroup.locator('.MainTab[title$="drop-split-down-dropped.txt"]')).toBeVisible()
}
