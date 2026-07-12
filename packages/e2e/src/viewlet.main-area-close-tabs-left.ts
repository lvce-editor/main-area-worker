import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-tabs-left'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`

  await FileSystem.setFiles([
    { content: 'content1', uri: file1 },
    { content: 'content2', uri: file2 },
    { content: 'content3', uri: file3 },
  ])

  // act - open 3 editors
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  // assert - all 3 tabs are visible
  const tab1 = Locator('.MainTab[title$="file1.ts"]')
  const tab2 = Locator('.MainTab[title$="file2.ts"]')
  const tab3 = Locator('.MainTab[title$="file3.ts"]')
  await expect(tab1).toBeVisible()
  await expect(tab2).toBeVisible()
  await expect(tab3).toBeVisible()

  // act - select second tab and close tabs to the left
  await Main.selectTab(0, 1)
  await Main.handleTabContextMenu(0, 0, 0)
  const closeLeftMenuItem = Locator('text=Close To The Left')
  await expect(closeLeftMenuItem).toBeVisible()
  // TODO: implement close tabs left context menu action

  // assert - only file2 and file3 remain
  // await expect(tab1).not.toBeVisible()
  // await expect(tab2).toBeVisible()
  // await expect(tab3).toBeVisible()
}
