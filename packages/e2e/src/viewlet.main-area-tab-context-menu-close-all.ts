import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-context-menu-close-all'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`
  await FileSystem.writeFile(file1, 'export const file1 = 1')
  await FileSystem.writeFile(file2, 'export const file2 = 2')
  await FileSystem.writeFile(file3, 'export const file3 = 3')
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  const tab1 = Locator('.MainTab[title$="file1.ts"]')
  const tab2 = Locator('.MainTab[title$="file2.ts"]')
  const tab3 = Locator('.MainTab[title$="file3.ts"]')
  await expect(tab1).toBeVisible()
  await expect(tab2).toBeVisible()
  await expect(tab3).toBeVisible()

  // act
  await Command.execute('Main.handleTabContextMenu', 0, 0)
  const closeAllMenuItem = Locator('text=Close All')
  await expect(closeAllMenuItem).toBeVisible()
  await closeAllMenuItem.click()

  // assert
  await expect(tab1).not.toBeVisible()
  await expect(tab2).not.toBeVisible()
  await expect(tab3).not.toBeVisible()
}
