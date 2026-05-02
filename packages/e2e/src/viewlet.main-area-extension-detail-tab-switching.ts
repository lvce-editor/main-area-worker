import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-extension-detail-tab-switching'

export const skip = 1

export const test: Test = async ({ expect, Locator, Main }) => {
  // arrange
  await Main.openUri('extension-detail://theme-ayu')
  await Main.openUri('extension-detail://chat')

  const themeAyuTab = Locator('.MainTab[title="theme-ayu"]')
  const chatTab = Locator('.MainTab[title="chat"]')
  await expect(themeAyuTab).toBeVisible()
  await expect(chatTab).toBeVisible()

  const selectedChatTab = Locator('.MainTabSelected[title="chat"]')
  await expect(selectedChatTab).toBeVisible()

  // act
  await Main.selectTab(0, 0)

  // assert
  const selectedThemeAyuTab = Locator('.MainTabSelected[title="theme-ayu"]')
  await expect(selectedThemeAyuTab).toBeVisible()
}
