import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-sequence-right-right'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.splitRight')
  await Command.execute('Main.splitRight')

  const editorGroups = Locator('.EditorGroup')
  const horizontalSashes = Locator('.Main .SashHorizontal')
  const verticalSashes = Locator('.Main .SashVertical')
  await expect(editorGroups).toHaveCount(3)
  await expect(horizontalSashes).toHaveCount(0)
  await expect(verticalSashes).toHaveCount(2)
}
