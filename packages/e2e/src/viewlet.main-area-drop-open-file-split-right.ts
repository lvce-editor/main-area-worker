import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-open-file-split-right'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/drop-open-file-split-right.txt`
  await FileSystem.writeFile(file, 'content')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(file)
  const itemId = await FileSystem.registerFileHandle({ kind: 'string', type: 'text/uri-list', value: file } as any)

  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', [itemId])

  const groups = Locator('.EditorGroup')
  const leftGroup = groups.nth(0)
  const rightGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  await expect(leftGroup.locator('.MainTab[title$="drop-open-file-split-right.txt"]')).toBeVisible()
  await expect(rightGroup.locator('.MainTab[title$="drop-open-file-split-right.txt"]')).toBeVisible()
}
