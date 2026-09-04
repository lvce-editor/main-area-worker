import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-cross-group-to-start'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['cross-start-a.txt', 'cross-start-b.txt', 'cross-start-c.txt', 'cross-start-d.txt']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files.slice(0, 2))
  await Main.splitRight()
  await Main.openUris(files.slice(2))
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[1] }])
  const leftTabs = Locator('.MainTab[data-group-index="0"]')
  const rightTabs = Locator('.MainTab[data-group-index="1"]')
  const leftTabTitles = names.slice(0, 1).map((_name, index) => Locator(`.MainTab[data-group-index="0"][data-index="${index}"] .TabTitle`))
  const rightTabTitles = names.slice(0, 3).map((_name, index) => Locator(`.MainTab[data-group-index="1"][data-index="${index}"] .TabTitle`))

  await leftTabs.nth(1).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '1', '0', 0, 100, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  await expect(leftTabs).toHaveCount(1)
  await expect(leftTabTitles[0]).toHaveText('cross-start-a.txt')
  await expect(rightTabs).toHaveCount(3)
  await expect(rightTabTitles[0]).toHaveText('cross-start-b.txt')
  await expect(rightTabTitles[1]).toHaveText('cross-start-c.txt')
  await expect(rightTabTitles[2]).toHaveText('cross-start-d.txt')
  const selectedTab = Locator('.MainTabSelected[title$="cross-start-b.txt"]')
  await expect(selectedTab).toBeVisible()
}
