import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-svg-file'

export const test: Test = async ({ expect, Locator, Main }) => {
  const testFile = import.meta.resolve('../fixtures/media/tiny.svg')

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="tiny.svg"]')
  await expect(tab).toBeVisible()

  const image = Locator('img').first()
  await expect(image).toBeVisible()
}
