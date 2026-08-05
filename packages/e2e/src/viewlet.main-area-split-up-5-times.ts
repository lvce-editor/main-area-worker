import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-up-5-times'

export const test: Test = async ({ Command, expect, Locator }) => {
  for (let index = 0; index < 5; index++) {
    await Command.execute('Main.splitUp')
  }

  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashHorizontal')
  await expect(editorGroups).toHaveCount(6)
  await expect(sashes).toHaveCount(5)
}
