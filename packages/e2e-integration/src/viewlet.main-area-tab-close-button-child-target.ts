import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-close-button-child-target'

const mouseDownEventInit = { bubbles: true, button: 0 } as unknown as string

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/close-child-target-1.ts`
  const file2 = `${tmpDir}/close-child-target-2.ts`
  const file3 = `${tmpDir}/close-child-target-3.ts`
  await FileSystem.setFiles([
    { content: 'one', uri: file1 },
    { content: 'two', uri: file2 },
    { content: 'three', uri: file3 },
  ])
  await Workspace.setUri(tmpDir)
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(3)

  const firstTab = Locator('.MainTab[title$="close-child-target-1.ts"]')
  const selectedThirdTab = Locator('.MainTabSelected[title$="close-child-target-3.ts"]')
  const inactiveCloseButton = Locator('.MainTab[title$="close-child-target-1.ts"] .EditorTabCloseButton')
  await Command.execute('TestFrameWork.performAction', inactiveCloseButton, 'dispatchEvent', {
    init: mouseDownEventInit,
    type: 'mousedown',
  })
  await expect(selectedThirdTab).toBeVisible()
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Exercise the close-button click after checking its mousedown event.
  await inactiveCloseButton.click()
  await expect(tabs).toHaveCount(2)
  await expect(firstTab).toBeHidden()
  await expect(selectedThirdTab).toBeVisible()

  const activeCloseIcon = Locator('.MainTabSelected[title$="close-child-target-3.ts"] .EditorTabCloseButton .MaskIconClose')
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Exercise nested close-icon click behavior.
  await activeCloseIcon.click()
  await expect(tabs).toHaveCount(1)
  await expect(Locator('.MainTabSelected[title$="close-child-target-2.ts"]')).toBeVisible()
}
