import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-two-rows'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutTwoRows')
  const groups = Locator('.EditorGroup')
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    const horizontal = flip % 2 === 0
    const groupHorizontal = horizontal
    const size = '50%'
    const style = groupHorizontal ? `width: ${size}; height: 100%;` : `width: 100%; height: ${size};`
    await expect(groups).toHaveCount(2)
    for (let index = 0; index < 2; index++) {
      const group = groups.nth(index)
      await expect(group).toHaveAttribute('style', style)
    }
    const sashes = Locator('.Main .Sash')
    await expect(sashes).toHaveCount(1)
  }
}
