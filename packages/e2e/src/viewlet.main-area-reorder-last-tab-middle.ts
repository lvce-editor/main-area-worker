import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-last-tab-middle'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = ['a.txt', 'b.txt', 'c.txt'].map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[2] }])
  const tabs = Locator('.MainTab')
  const firstTab = tabs.nth(0)
  const secondTab = tabs.nth(1)
  const thirdTab = tabs.nth(2)

  await thirdTab.dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '0', '1', 100, 100, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  await expect(firstTab.locator('.TabTitle')).toHaveText('a.txt')
  await expect(secondTab.locator('.TabTitle')).toHaveText('c.txt')
  await expect(thirdTab.locator('.TabTitle')).toHaveText('b.txt')
}
