import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-multiple-files-split-right'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const original = `${tmpDir}/drop-multiple-original.txt`
  const dropped = [`${tmpDir}/drop-multiple-first.txt`, `${tmpDir}/drop-multiple-second.txt`, `${tmpDir}/drop-multiple-third.txt`]
  await FileSystem.setFiles([{ content: 'original', uri: original }, ...dropped.map((uri, index) => ({ content: `dropped ${index}`, uri }))])
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(original)
  const dropId = await DragAndDrop.createDropSession(dropped.map((value) => ({ kind: 'string' as const, type: 'text/uri-list', value })))

  await Command.execute('Main.handleDragOver', 10_000, 300)
  await Main.handleClickAction('', '')
  await Command.execute('Main.handleDrop', dropId)

  const groups = Locator('.EditorGroup')
  const leftGroup = groups.nth(0)
  const rightGroup = groups.nth(1)
  await expect(groups).toHaveCount(2)
  const leftGroupOriginalTab = leftGroup.locator('.MainTab[title$="drop-multiple-original.txt"]')
  await expect(leftGroupOriginalTab).toBeVisible()
  const rightGroupTabs = rightGroup.locator('.MainTab')
  await expect(rightGroupTabs).toHaveCount(3)
  const rightGroupFirstTab = rightGroup.locator('.MainTab[title$="drop-multiple-first.txt"]')
  await expect(rightGroupFirstTab).toBeVisible()
  const rightGroupSecondTab = rightGroup.locator('.MainTab[title$="drop-multiple-second.txt"]')
  await expect(rightGroupSecondTab).toBeVisible()
  const rightGroupThirdTab = rightGroup.locator('.MainTab[title$="drop-multiple-third.txt"]')
  await expect(rightGroupThirdTab).toBeVisible()
}
