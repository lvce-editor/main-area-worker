import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-png-file'

export const test: Test = async ({ expect, Locator, Main }) => {
  const testFile = import.meta.resolve('../fixtures/media/tiny.png')

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="tiny.png"]')
  await expect(tab).toBeVisible()

  const image = Locator('img').first()
  await expect(image).toBeVisible()
}
