import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-down-8-times'

export const test: Test = async ({ expect, Locator, Main }) => {
  for (let index = 0; index < 8; index++) {
    await Main.splitDown()
  }

  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashHorizontal')
  await expect(editorGroups).toHaveCount(9)
  await expect(sashes).toHaveCount(8)
}
