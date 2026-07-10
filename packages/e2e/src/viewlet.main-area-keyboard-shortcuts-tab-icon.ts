import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-keyboard-shortcuts-tab-icon'

export const test: Test = async ({ expect, Locator, Main }) => {
  // arrange

  // act
  await Main.openUri('app://keybindings')

  // assert
  const tab = Locator('.MainTab[title="app://keybindings"]')
  await expect(tab).toBeVisible()
  const icon = tab.locator('.TabIcon .MaskIconRecordKey')
  await expect(icon).toBeVisible()
}
