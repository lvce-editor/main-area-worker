import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-webp-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const testFile = import.meta.resolve('../fixtures/media/tiny.webp')

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="tiny.webp"]')
  await expect(tab).toBeVisible()

  const image = Locator('img').first()
  await expect(image).toBeVisible()
}
