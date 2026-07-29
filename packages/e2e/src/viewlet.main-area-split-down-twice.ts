import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-down-twice'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.splitDown()
  await Main.splitDown()

  const locator1 = Locator('.EditorGroup')
  await expect(locator1).toHaveCount(3)
  const locator2 = Locator('.Main .SashHorizontal')
  await expect(locator2).toHaveCount(2)
}
