import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-extension-detail-tab-title'

export const skip = 1

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.openUri('extension-detail://theme-ayu')

  const tab = Locator('.MainTab[title="Ayu Theme"]')
  await expect(tab).toBeVisible()
}
