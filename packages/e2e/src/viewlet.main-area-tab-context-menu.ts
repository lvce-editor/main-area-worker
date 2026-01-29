import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-context-menu'

// export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Playwright }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test-context-menu.ts`
  const testContent = 'export const test = () => "hello"'
  await FileSystem.writeFile(testFile, testContent)

  // act
  await Main.openUri(testFile)

  // assert - verify tab is visible
  const tab = Locator('.MainTab[title$="test-context-menu.ts"]')
  await expect(tab).toBeVisible()

  // act - right-click on tab to open context menu
  const page = Playwright.page()
  await tab.click({
    button: 'right',
  })

  // assert - verify context menu items are displayed
  const closeMenuItem = Locator('text=Close').first()
  await expect(closeMenuItem).toBeVisible()

  const closeOthersMenuItem = Locator('text=Close Others')
  await expect(closeOthersMenuItem).toBeVisible()

  const closeToTheRightMenuItem = Locator('text=Close to the Right')
  await expect(closeToTheRightMenuItem).toBeVisible()

  const closeAllMenuItem = Locator('text=Close All')
  await expect(closeAllMenuItem).toBeVisible()

  const revealInExplorerMenuItem = Locator('text=Reveal in Explorer')
  await expect(revealInExplorerMenuItem).toBeVisible()

  const findReferencesMenuItem = Locator('text=Find File References')
  await expect(findReferencesMenuItem).toBeVisible()
}
