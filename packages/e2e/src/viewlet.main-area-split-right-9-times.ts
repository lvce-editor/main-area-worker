import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-9-times'

export const test: Test = async ({ expect, Locator, Main }) => {
  for (let index = 0; index < 9; index++) {
    await Main.splitRight()
  }

  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashVertical')
  await expect(editorGroups).toHaveCount(10)
  await expect(sashes).toHaveCount(9)
}
