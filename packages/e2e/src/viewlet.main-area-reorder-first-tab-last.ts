import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-first-tab-last'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [1, 2, 3].map((index) => `${tmpDir}/reorder-first-last-${index}.txt`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: String(index), uri })))
  await Main.closeAllEditors()
  await Main.openUris(files)
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: files[0] }])
  const tabs = Locator('.MainTab')
  const firstTab = tabs.nth(0)
  const secondTab = tabs.nth(1)
  const thirdTab = tabs.nth(2)

  await firstTab.dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Locator('.MainTabs').dispatchEvent('dragover', { bubbles: true, clientX: 10_000, clientY: 10 } as any)
  await Main.handleClickAction('', '')

  await expect(thirdTab).toHaveAttribute('style', 'box-shadow: white -2px 0px 0px inset;')
  await Command.execute('Main.handleDrop', dropId)
  const firstTabTitle = firstTab.locator('.TabTitle')
  await expect(firstTabTitle).toHaveText('reorder-first-last-2.txt')
  const secondTabTitle = secondTab.locator('.TabTitle')
  await expect(secondTabTitle).toHaveText('reorder-first-last-3.txt')
  const thirdTabTitle = thirdTab.locator('.TabTitle')
  await expect(thirdTabTitle).toHaveText('reorder-first-last-1.txt')
}
