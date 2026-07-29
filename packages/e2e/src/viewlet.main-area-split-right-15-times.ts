import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-15-times'

export const test: Test = async ({ expect, Locator, Main }) => {
  for (let index = 0; index < 15; index++) {
    await Main.splitRight()
  }
  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashVertical')
  await expect(editorGroups).toHaveCount(16)
  await expect(sashes).toHaveCount(15)
}
