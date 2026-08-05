import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-file-repeated-splits'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
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
  const firstItemId = await FileSystem.registerFileHandle({ kind: 'string', type: 'text/uri-list', value: first } as any)
  const secondItemId = await FileSystem.registerFileHandle({ kind: 'string', type: 'text/uri-list', value: second } as any)

  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', [firstItemId])
  await Command.execute('Main.handleDragOver', 0, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', [secondItemId])

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const secondGroup = groups.nth(1)
  const thirdGroup = groups.nth(2)
  await expect(groups).toHaveCount(3)
  await expect(firstGroup.locator('.MainTab[title$="drop-repeated-original.txt"]')).toBeVisible()
  await expect(secondGroup.locator('.MainTab[title$="drop-repeated-second.txt"]')).toBeVisible()
  await expect(thirdGroup.locator('.MainTab[title$="drop-repeated-first.txt"]')).toBeVisible()
}
