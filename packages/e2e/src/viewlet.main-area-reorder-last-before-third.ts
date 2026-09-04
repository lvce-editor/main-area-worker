import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-last-before-third'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['last-before-third-a.txt', 'last-before-third-b.txt', 'last-before-third-c.txt', 'last-before-third-d.txt']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[3] }])
  const tabs = Locator('.MainTab')
  const tabTitles = names.map((_name, index) => Locator(`.MainTab[data-index="${index}"] .TabTitle`))

  await tabs.nth(3).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '0', '2', 200, 100, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  await expect(tabTitles[0]).toHaveText('last-before-third-a.txt')
  await expect(tabTitles[1]).toHaveText('last-before-third-b.txt')
  await expect(tabTitles[2]).toHaveText('last-before-third-d.txt')
  await expect(tabTitles[3]).toHaveText('last-before-third-c.txt')
}
