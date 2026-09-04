import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-after-itself-noop'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['after-self-a.txt', 'after-self-b.txt', 'after-self-c.txt']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[1] }])
  const tabs = Locator('.MainTab')
  const tabTitles = names.map((_name, index) => Locator(`.MainTab[data-index="${index}"] .TabTitle`))

  await tabs.nth(1).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '0', '2', 200, 100, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  await expect(tabTitles[0]).toHaveText('after-self-a.txt')
  await expect(tabTitles[1]).toHaveText('after-self-b.txt')
  await expect(tabTitles[2]).toHaveText('after-self-c.txt')
}
