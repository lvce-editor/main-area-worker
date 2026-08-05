import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-sequence-right-down-right'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.splitRight')
  await Command.execute('Main.splitDown')
  await Command.execute('Main.splitRight')

  const editorGroups = Locator('.EditorGroup')
  const horizontalSashes = Locator('.Main .SashHorizontal')
  const verticalSashes = Locator('.Main .SashVertical')
  await expect(editorGroups).toHaveCount(4)
  await expect(horizontalSashes).toHaveCount(1)
  await expect(verticalSashes).toHaveCount(2)
}
