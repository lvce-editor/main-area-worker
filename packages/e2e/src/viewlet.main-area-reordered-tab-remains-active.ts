import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reordered-tab-remains-active'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const first = `${tmpDir}/reorder-active-1.txt`
  const second = `${tmpDir}/reorder-active-2.txt`
  await FileSystem.setFiles([
    { content: 'first', uri: first },
    { content: 'second', uri: second },
  ])
  await Main.closeAllEditors()
  await Main.openUris([first, second])
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: first }])
  const tabs = Locator('.MainTab')

  await tabs.nth(0).dispatchEvent('mousedown', { bubbles: true, button: 0 } as any)
  await Locator('.MainTabs').dispatchEvent('dragover', { bubbles: true, clientX: 10_000, clientY: 10 } as any)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  const movedTab = tabs.nth(1)
  await expect(movedTab.locator('.TabTitle')).toHaveText('reorder-active-1.txt')
  await expect(movedTab).toHaveClass('MainTabSelected')
  await expect(movedTab).toHaveAttribute('aria-selected', 'true')
}
