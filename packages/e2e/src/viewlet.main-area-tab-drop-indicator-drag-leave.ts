import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-drop-indicator-drag-leave'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const first = `${tmpDir}/a.txt`
  const second = `${tmpDir}/b.txt`
  await FileSystem.setFiles([
    { content: 'first', uri: first },
    { content: 'second', uri: second },
  ])
  await Main.closeAllEditors()
  await Main.openUris([first, second])
  const tabs = Locator('.MainTab')
  const firstTab = tabs.nth(0)
  const secondTab = tabs.nth(1)
  const tabDropIndicator = Locator('.MainTab[style*="box-shadow"]')

  await Command.execute('TestFrameWork.performAction', secondTab, 'dispatchEvent', { init: { bubbles: true, button: 0 } as any, type: 'mousedown' })
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '0', '0', 0, 100, 0)
  await Main.handleClickAction('', '')
  await expect(firstTab).toHaveAttribute('style', 'box-shadow: white 2px 0px 0px inset;')

  await Command.execute('TestFrameWork.performAction', Locator('.Main'), 'dispatchEvent', { init: { bubbles: true } as any, type: 'dragleave' })
  await Main.handleClickAction('', '')
  await expect(tabDropIndicator).toHaveCount(0)
}
