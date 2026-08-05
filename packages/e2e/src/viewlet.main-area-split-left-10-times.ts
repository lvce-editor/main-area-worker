import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-left-10-times'

export const test: Test = async ({ Command, expect, Locator }) => {
  for (let index = 0; index < 10; index++) {
    await Command.execute('Main.splitLeft')
  }

  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashVertical')
  await expect(editorGroups).toHaveCount(11)
  await expect(sashes).toHaveCount(10)
}
