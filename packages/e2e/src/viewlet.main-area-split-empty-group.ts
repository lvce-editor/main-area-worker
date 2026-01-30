import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-empty-group'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange

  // act
  await Command.execute('Main.splitRight')

  // TODO: Add assertions for split functionality
  const editorGroups = Locator('.EditorGroup')
  await expect(editorGroups).toHaveCount(2)
}
