import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-context-menu-inactive-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/context-menu-inactive-1.ts`
  const file2 = `${tmpDir}/context-menu-inactive-2.ts`
  await FileSystem.setFiles([
    { content: 'export const first = 1', uri: file1 },
    { content: 'export const second = 2', uri: file2 },
  ])
  await Main.openUri(file1)
  await Main.openUri(file2)

  const inactiveTab = Locator('.MainTab[title$="context-menu-inactive-1.ts"]')
  const activeTab = Locator('.MainTabSelected[title$="context-menu-inactive-2.ts"]')
  await expect(inactiveTab).toBeVisible()
  await expect(activeTab).toBeVisible()

  // act
  // eslint-disable-next-line e2e/no-direct-click -- Right-click is the behavior under test and the main-area page object has no mouse-button API.
  await inactiveTab.click({ button: 'right' })

  // assert
  await expect(activeTab).toBeVisible()
  const inactiveSelectedTab = Locator('.MainTabSelected[title$="context-menu-inactive-1.ts"]')
  await expect(inactiveSelectedTab).toBeHidden()
  const closeMenuItem = Locator('text=Close').first()
  await expect(closeMenuItem).toBeVisible()
}
