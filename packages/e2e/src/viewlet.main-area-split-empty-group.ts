import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-empty-group'

export const test: Test = async ({ FileSystem, Main }) => {
  // arrange
  await Main.closeAllEditors()

  // act
  await Main.splitRight()

  // TODO: Add assertions for split functionality
}
