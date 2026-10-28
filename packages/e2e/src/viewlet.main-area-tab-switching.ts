import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-switching'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.py`
  const file2 = `${tmpDir}/file2.py`
  const file3 = `${tmpDir}/file3.py`
  await FileSystem.setFiles([
    { content: 'content1', uri: file1 },
    { content: 'content2', uri: file2 },
    { content: 'content3', uri: file3 },
  ])
  await Main.openUri(file1)
  await Editor.setCursor(0, 0)
  await Main.openUri(file2)
  await Editor.setCursor(0, 0)
  await Main.openUri(file3)
  await Editor.setCursor(0, 0)

  // act
  await Main.selectTab(0, 0)

  // assert
  const selectedTab1 = Locator('.MainTabSelected[title$="file1.py"]')
  const selectedTab1Icon = selectedTab1.locator('img.TabIcon[src]')
  const selectedTab2Icon = Locator('.MainTabSelected[title$="file2.py"] img.TabIcon[src]')
  const cursor = Locator('.EditorCursor')
  await expect(selectedTab1).toBeVisible()
  await expect(selectedTab1Icon).toBeVisible()
  await expect(cursor).toBeVisible()
  await expect(cursor).toHaveCSS('translate', '0px')
  for (let i = 0; i < 5; i++) {
    await Main.selectTab(0, 1)
    await expect(selectedTab2Icon).toBeVisible()
    await expect(cursor).toBeVisible()
    await expect(cursor).toHaveCSS('translate', '0px')
    await Main.selectTab(0, 0)
    await expect(selectedTab1Icon).toBeVisible()
    await expect(cursor).toBeVisible()
    await expect(cursor).toHaveCSS('translate', '0px')
  }
}
