import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-then-down'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.splitRight()
  await Main.splitDown()

  const locator1 = Locator('.EditorGroup')
  await expect(locator1).toHaveCount(3)
  const locator2 = Locator('.Main .SashVertical')
  await expect(locator2).toHaveCount(1)
  const locator3 = Locator('.Main .SashHorizontal')
  await expect(locator3).toHaveCount(1)
}
