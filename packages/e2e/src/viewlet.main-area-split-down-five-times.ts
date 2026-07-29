import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-down-five-times'

export const test: Test = async ({ expect, Locator, Main }) => {
  for (let i = 0; i < 5; i++) {
    await Main.splitDown()
  }

  const locator1 = Locator('.EditorGroup')
  await expect(locator1).toHaveCount(6)
  const locator2 = Locator('.Main .SashHorizontal')
  await expect(locator2).toHaveCount(5)
}
