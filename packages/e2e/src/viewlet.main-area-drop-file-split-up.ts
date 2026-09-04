import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-file-split-up'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-split-up-original.txt`
  const dropped = `${tmpDir}/drop-split-up-dropped.txt`
  await FileSystem.setFiles([
    { content: 'original', uri: original },
    { content: 'dropped', uri: dropped },
  ])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: dropped }])

  await Command.execute('Main.handleDragOver', 500, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  const groups = Locator('.EditorGroup')
  const topGroup = groups.nth(0)
  const bottomGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  await expect(topGroup.locator('.MainTab[title$="drop-split-up-dropped.txt"]')).toBeVisible()
  await expect(bottomGroup.locator('.MainTab[title$="drop-split-up-original.txt"]')).toBeVisible()
}
