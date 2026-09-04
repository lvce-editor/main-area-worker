import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-cross-group-to-end'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['cross-end-a.txt', 'cross-end-b.txt', 'cross-end-c.txt', 'cross-end-d.txt']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files.slice(0, 2))
  await Main.splitRight()
  await Main.openUris(files.slice(2))
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[2] }])
  const leftTabs = Locator('.MainTab[data-group-index="0"]')
  const rightTabs = Locator('.MainTab[data-group-index="1"]')
  const leftTabBar = Locator('.MainTabs[data-group-index="0"]')
  const leftTabTitles = names.slice(0, 3).map((_name, index) => Locator(`.MainTab[data-group-index="0"][data-index="${index}"] .TabTitle`))
  const rightTabTitles = names.slice(0, 1).map((_name, index) => Locator(`.MainTab[data-group-index="1"][data-index="${index}"] .TabTitle`))

  await rightTabs.nth(0).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await leftTabBar.dispatchEvent('dragover', { bubbles: true, clientX: 10_000, clientY: 10 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  await expect(leftTabs).toHaveCount(3)
  await expect(leftTabTitles[0]).toHaveText('cross-end-a.txt')
  await expect(leftTabTitles[1]).toHaveText('cross-end-b.txt')
  await expect(leftTabTitles[2]).toHaveText('cross-end-c.txt')
  await expect(rightTabs).toHaveCount(1)
  await expect(rightTabTitles[0]).toHaveText('cross-end-d.txt')
  const selectedTab = Locator('.MainTabSelected[title$="cross-end-c.txt"]')
  await expect(selectedTab).toBeVisible()
}
