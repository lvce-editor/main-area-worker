import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-empty'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutSingle')
  const group = Locator('.EditorGroup')
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    await expect(group).toHaveCount(1)
    await expect(group).toHaveAttribute('style', 'width: 100%; height: 100%;')
    await expect(Locator('.Main .Sash')).toHaveCount(0)
  }
}
