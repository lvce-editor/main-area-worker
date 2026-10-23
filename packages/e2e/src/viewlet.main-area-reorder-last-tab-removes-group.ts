import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reorder-last-tab-removes-group'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const sourceFile = `${tmpDir}/last-tab-source.txt`
  const targetFile = `${tmpDir}/last-tab-target.txt`
  await FileSystem.setFiles([
    { content: 'source', uri: sourceFile },
    { content: 'target', uri: targetFile },
  ])
  await Main.closeAllEditors()
  await Main.openUri(sourceFile)
  await Main.splitDown()
  await Main.openUri(targetFile)

  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: sourceFile }])
  const sourceTabs = Locator('.MainTab[data-group-index="0"]')
  await Command.execute('TestFrameWork.performAction', sourceTabs.nth(0), 'dispatchEvent', {
    init: { bubbles: true, button: 0 } as any,
    type: 'mousedown',
  })
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDragOver', 0, 10, '1', '0', 0, 100, 0)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  const groups = Locator('.EditorGroup')
  await expect(groups).toHaveCount(1)
  const targetGroup = groups.nth(0)
  const targetTabs = targetGroup.locator('.MainTab')
  const selectedSourceTab = Locator('.MainTabSelected[title$="last-tab-source.txt"]')
  await expect(targetTabs).toHaveCount(2)
  await expect(selectedSourceTab).toBeVisible()
}
