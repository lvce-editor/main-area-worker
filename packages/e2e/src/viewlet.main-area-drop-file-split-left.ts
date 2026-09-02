import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-file-split-left'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-split-left-original.txt`
  const dropped = `${tmpDir}/drop-split-left-dropped.txt`
  await FileSystem.setFiles([
    { content: 'original', uri: original },
    { content: 'dropped', uri: dropped },
  ])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: dropped }])

  await Command.execute('Main.handleDragOver', 0, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  const groups = Locator('.EditorGroup')
  const leftGroup = groups.nth(0)
  const rightGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  await expect(leftGroup.locator('.MainTab[title$="drop-split-left-dropped.txt"]')).toBeVisible()
  await expect(rightGroup.locator('.MainTab[title$="drop-split-left-original.txt"]')).toBeVisible()
}
