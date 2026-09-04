import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-same-tab-round-trip'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['round-trip-a.txt', 'round-trip-b.txt', 'round-trip-c.txt', 'round-trip-d.txt']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files)
  const tabs = Locator('.MainTab')
  const tabTitles = names.map((_name, index) => Locator(`.MainTab[data-index="${index}"] .TabTitle`))
  const tabBar = Locator('.MainTabs')
  const firstDropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[0] }])

  await tabs.nth(0).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await tabBar.dispatchEvent('dragover', { bubbles: true, clientX: 10_000, clientY: 10 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', firstDropId)
  await expect(tabTitles[0]).toHaveText('round-trip-b.txt')
  await expect(tabTitles[1]).toHaveText('round-trip-c.txt')
  await expect(tabTitles[2]).toHaveText('round-trip-d.txt')
  await expect(tabTitles[3]).toHaveText('round-trip-a.txt')

  const secondDropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[0] }])
  await tabs.nth(3).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '0', '0', 0, 100, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', secondDropId)

  await expect(tabTitles[0]).toHaveText('round-trip-a.txt')
  await expect(tabTitles[1]).toHaveText('round-trip-b.txt')
  await expect(tabTitles[2]).toHaveText('round-trip-c.txt')
  await expect(tabTitles[3]).toHaveText('round-trip-d.txt')
}
