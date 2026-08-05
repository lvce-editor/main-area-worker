import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-left-5-times'

export const test: Test = async ({ Command, expect, Locator }) => {
  for (let index = 0; index < 5; index++) {
    await Command.execute('Main.splitLeft')
  }

  const editorGroups = Locator('.EditorGroup')
  const sashes = Locator('.Main .SashVertical')
  await expect(editorGroups).toHaveCount(6)
  await expect(sashes).toHaveCount(5)
}
