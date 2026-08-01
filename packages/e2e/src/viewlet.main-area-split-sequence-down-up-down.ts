import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-sequence-down-up-down'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.splitDown')
  await Command.execute('Main.splitUp')
  await Command.execute('Main.splitDown')

  const editorGroups = Locator('.EditorGroup')
  const horizontalSashes = Locator('.Main .SashHorizontal')
  const verticalSashes = Locator('.Main .SashVertical')
  await expect(editorGroups).toHaveCount(4)
  await expect(horizontalSashes).toHaveCount(3)
  await expect(verticalSashes).toHaveCount(0)
}
