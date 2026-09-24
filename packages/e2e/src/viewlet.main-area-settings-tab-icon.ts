import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-settings-tab-icon'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.openUri('app://keybindings')
  await Main.openUri('settings://')

  const settingsTab = Locator('.MainTab[title="settings://"]')
  const settingsIcon = settingsTab.locator('.TabIcon .MaskIconSettingsGear')
  await expect(settingsTab).toBeVisible()
  await expect(settingsTab).toHaveAttribute('aria-selected', 'true')
  await expect(settingsIcon).toBeVisible()

  await expect(Locator('.MainTab[title="app://keybindings"] .TabIcon .MaskIconRecordKey')).toBeVisible()

  await Main.openUri('app://keybindings')
  await expect(settingsTab).toHaveAttribute('aria-selected', 'false')
  await expect(settingsIcon).toBeVisible()
}
