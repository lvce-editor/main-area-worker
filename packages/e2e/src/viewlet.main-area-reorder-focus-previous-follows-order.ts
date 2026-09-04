import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-focus-previous-follows-order'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['focus-previous-a.txt', 'focus-previous-b.txt', 'focus-previous-c.txt']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files)
  await Main.selectTab(0, 0)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[0] }])
  const tabs = Locator('.MainTab')
  const tabTitles = names.map((_name, index) => Locator(`.MainTab[data-index="${index}"] .TabTitle`))

  await tabs.nth(0).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Locator('.MainTabs').dispatchEvent('dragover', { bubbles: true, clientX: 10_000, clientY: 10 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)
  await Main.focusPrevious()

  await expect(tabTitles[0]).toHaveText('focus-previous-b.txt')
  await expect(tabTitles[1]).toHaveText('focus-previous-c.txt')
  await expect(tabTitles[2]).toHaveText('focus-previous-a.txt')
  const selectedTab = Locator('.MainTabSelected[title$="focus-previous-c.txt"]')
  await expect(selectedTab).toBeVisible()
}
