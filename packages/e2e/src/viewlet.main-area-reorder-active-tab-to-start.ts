import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-active-tab-to-start'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['active-a.txt', 'active-b.txt', 'active-c.txt']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `content-${index}`, uri })))
  await Main.closeAllEditors()
  await Main.openUris(files)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[2] }])
  const tabs = Locator('.MainTab')
  const movedTab = tabs.nth(0)
  const tabTitles = names.map((_name, index) => Locator(`.MainTab[data-index="${index}"] .TabTitle`))

  await tabs.nth(2).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '0', '0', 0, 100, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  await expect(tabTitles[0]).toHaveText('active-c.txt')
  await expect(tabTitles[1]).toHaveText('active-a.txt')
  await expect(tabTitles[2]).toHaveText('active-b.txt')
  await expect(movedTab).toHaveClass('MainTabSelected')
  await expect(movedTab).toHaveAttribute('aria-selected', 'true')
}
