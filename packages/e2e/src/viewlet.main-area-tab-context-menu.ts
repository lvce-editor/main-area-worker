import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-context-menu'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test-context-menu.ts`
  const testContent = 'export const test = () => "hello"'
  await FileSystem.writeFile(testFile, testContent)
  await Main.openUri(testFile)
  const tab = Locator('.MainTab[title$="test-context-menu.ts"]')
  await expect(tab).toBeVisible()

  // act
  await Command.execute('Main.handleTabContextMenu', 0, 0)

  // assert
  const closeMenuItem = Locator('text=Close').first()
  await expect(closeMenuItem).toBeVisible()
  const closeOthersMenuItem = Locator('text=Close Others')
  await expect(closeOthersMenuItem).toBeVisible()
  const closeToTheRightMenuItem = Locator('text=Close To The Right')
  await expect(closeToTheRightMenuItem).toBeVisible()
  const closeAllMenuItem = Locator('text=Close All')
  await expect(closeAllMenuItem).toBeVisible()
  const revealInExplorerMenuItem = Locator('text=Reveal in Explorer')
  await expect(revealInExplorerMenuItem).toBeVisible()
  const findReferencesMenuItem = Locator('text=Find File References')
  await expect(findReferencesMenuItem).toBeVisible()
}
