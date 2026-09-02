import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drag-only-tab-split-right'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/drag-only-tab-split-right.txt`
  await FileSystem.writeFile(file, 'content')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(file)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: file }])

  const tab = Locator('.MainTab[title$="drag-only-tab-split-right.txt"]')
  await tab.dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Command.execute('Main.handleDrop', dropId)

  const groups = Locator('.EditorGroup')
  const group = groups.nth(0)
  await expect(groups).toHaveCount(1)
  await expect(group.locator('.MainTab')).toHaveCount(1)
  await expect(group.locator('.MainTab[title$="drag-only-tab-split-right.txt"]')).toBeVisible()
}
