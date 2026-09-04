import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-file-repeated-splits'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-repeated-original.txt`
  const first = `${tmpDir}/drop-repeated-first.txt`
  const second = `${tmpDir}/drop-repeated-second.txt`
  await FileSystem.setFiles([
    { content: 'original', uri: original },
    { content: 'first', uri: first },
    { content: 'second', uri: second },
  ])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const firstDropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: first }])
  const secondDropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: second }])

  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', firstDropId)
  await Command.execute('Main.handleDragOver', 0, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', secondDropId)

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const secondGroup = groups.nth(1)
  const thirdGroup = groups.nth(2)
  await expect(groups).toHaveCount(3)
  await expect(firstGroup.locator('.MainTab[title$="drop-repeated-second.txt"]')).toBeVisible()
  await expect(secondGroup.locator('.MainTab[title$="drop-repeated-original.txt"]')).toBeVisible()
  await expect(thirdGroup.locator('.MainTab[title$="drop-repeated-first.txt"]')).toBeVisible()
}
