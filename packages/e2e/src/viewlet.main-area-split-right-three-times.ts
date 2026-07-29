import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-three-times'

export const test: Test = async ({ expect, Locator, Main }) => {
  for (let i = 0; i < 3; i++) {
    await Main.splitRight()
  }

  const locator1 = Locator('.EditorGroup')
  await expect(locator1).toHaveCount(4)
  const locator2 = Locator('.Main .SashVertical')
  await expect(locator2).toHaveCount(3)
}
