import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-three-columns'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutThreeColumns')
  const groups = Locator('.EditorGroup')
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    const horizontal = flip % 2 === 1
    // Browsers serialize fractional percentages with different precision.
    const dimensions = horizontal ? '[style*="width: 33.3333"][style*="height: 100%;"]' : '[style*="width: 100%;"][style*="height: 33.3333"]'
    const sizedGroups = Locator(`.EditorGroup${dimensions}`)
    await expect(groups).toHaveCount(3)
    await expect(sizedGroups).toHaveCount(3)
    const sashes = Locator('.Main .Sash')
    await expect(sashes).toHaveCount(2)
  }
}
