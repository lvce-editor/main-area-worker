import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-empty-group-horizontal'

export const test: Test = async ({ Command, expect, Locator }) => {
  // act
  await Command.execute('Main.splitDown')

  // assert: two editor groups exist
  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(2)

  // assert: layout is horizontal
  // const editorArea = Locator('.EditorArea')
  // await expect(editorArea).toHaveAttribute('data-layout', 'horizontal')
}
