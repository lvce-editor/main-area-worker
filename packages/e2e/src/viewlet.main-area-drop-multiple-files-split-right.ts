import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-multiple-files-split-right'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-multiple-original.txt`
  const dropped = [`${tmpDir}/drop-multiple-first.txt`, `${tmpDir}/drop-multiple-second.txt`, `${tmpDir}/drop-multiple-third.txt`]
  await FileSystem.setFiles([{ content: 'original', uri: original }, ...dropped.map((uri, index) => ({ content: `dropped ${index}`, uri }))])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const dropId = await DragAndDrop.createDropSession(dropped.map((value) => ({ kind: 'string' as const, type: 'text/uri-list', value })))

  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  const groups = Locator('.EditorGroup')
  const leftGroup = groups.nth(0)
  const rightGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  await expect(leftGroup.locator('.MainTab[title$="drop-multiple-original.txt"]')).toBeVisible()
  await expect(rightGroup.locator('.MainTab')).toHaveCount(3)
  await expect(rightGroup.locator('.MainTab[title$="drop-multiple-first.txt"]')).toBeVisible()
  await expect(rightGroup.locator('.MainTab[title$="drop-multiple-second.txt"]')).toBeVisible()
  await expect(rightGroup.locator('.MainTab[title$="drop-multiple-third.txt"]')).toBeVisible()
}
