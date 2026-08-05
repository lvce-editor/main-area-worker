import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-up-20-times'

export const test: Test = async ({ Command, expect, Locator }) => {
  for (let index = 0; index < 20; index++) {
    await Command.execute('Main.splitUp')
  }

  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashHorizontal')
  await expect(editorGroups).toHaveCount(21)
  await expect(sashes).toHaveCount(20)
}
