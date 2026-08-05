import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-up-4-times'

export const test: Test = async ({ Command, expect, Locator }) => {
  for (let index = 0; index < 4; index++) {
    await Command.execute('Main.splitUp')
  }

  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashHorizontal')
  await expect(editorGroups).toHaveCount(5)
  await expect(sashes).toHaveCount(4)
}
