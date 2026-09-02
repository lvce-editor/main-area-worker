import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drag-tab-split-right'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const first = `${tmpDir}/drag-tab-split-right-first.txt`
  const second = `${tmpDir}/drag-tab-split-right-second.txt`
  await FileSystem.setFiles([
    { content: 'first', uri: first },
    { content: 'second', uri: second },
  ])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(first)
  await Main.openUri(second)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: first }])

  const firstTab = Locator('.MainTab[title$="drag-tab-split-right-first.txt"]')
  await firstTab.dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Command.execute('Main.handleDrop', dropId)

  const groups = Locator('.EditorGroup')
  const leftGroup = groups.nth(0)
  const rightGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  await expect(leftGroup.locator('.MainTab')).toHaveCount(1)
  await expect(leftGroup.locator('.MainTab[title$="drag-tab-split-right-second.txt"]')).toBeVisible()
  await expect(rightGroup.locator('.MainTab')).toHaveCount(1)
  await expect(rightGroup.locator('.MainTab[title$="drag-tab-split-right-first.txt"]')).toBeVisible()
}
