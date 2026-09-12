import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-three-rows'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutThreeRows')
  const groups = Locator('.EditorGroup')
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    const horizontal = flip % 2 === 0
    const groupHorizontal = horizontal
    const size = '33.3333%'
    const style = groupHorizontal ? `width: ${size}; height: 100%;` : `width: 100%; height: ${size};`
    await expect(groups).toHaveCount(3)
    for (let index = 0; index < 3; index++) {
      await expect(groups.nth(index)).toHaveAttribute('style', style)
    }
    await expect(Locator('.Main .Sash')).toHaveCount(2)
  }
}
