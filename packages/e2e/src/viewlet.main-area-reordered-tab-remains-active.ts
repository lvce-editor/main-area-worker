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

  await Command.execute('TestFrameWork.performAction', tabs.nth(0), 'dispatchEvent', { init: { bubbles: true, button: 0 } as any, type: 'mousedown' })
  await Command.execute('TestFrameWork.performAction', Locator('.MainTabs'), 'dispatchEvent', {
    init: { bubbles: true, clientX: 10_000, clientY: 10 } as any,
    type: 'dragover',
  })
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  const movedTab = tabs.nth(1)
  const movedTabTitle = movedTab.locator('.TabTitle')
  await expect(movedTabTitle).toHaveText('reorder-active-1.txt')
  await expect(movedTab).toHaveClass('MainTabSelected')
  await expect(movedTab).toHaveAttribute('aria-selected', 'true')
}
