import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-nonexistent-extension-detail'

export const skip = 1

export const test: Test = async ({ expect, Locator, Main }) => {
  const extensionId = 'does-not-exist'

  await Main.openUri(`extension-detail://${extensionId}`)

  const main = Locator('.Main')
  await expect(main).toContainText(`extension not found: ${extensionId}`)
}
