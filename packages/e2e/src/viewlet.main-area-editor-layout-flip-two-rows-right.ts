import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-two-rows-right'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutTwoRowsRight')
  const groups = Locator('.EditorGroup')
  const nested = Locator('.Main .editor-groups-container .editor-groups-container')
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    const horizontal = flip % 2 === 1
    const rootStyle = horizontal ? 'width: 50%; height: 100%;' : 'width: 100%; height: 50%;'
    const nestedStyle = horizontal ? 'width: 100%; height: 50%;' : 'width: 50%; height: 100%;'
    await expect(groups).toHaveCount(3)
    const firstGroup = groups.nth(0)
    await expect(firstGroup).toHaveAttribute('style', rootStyle)
    await expect(nested).toHaveCount(1)
    await expect(nested).toHaveAttribute('style', rootStyle)
    const secondGroup = groups.nth(1)
    await expect(secondGroup).toHaveAttribute('style', nestedStyle)
    const thirdGroup = groups.nth(2)
    await expect(thirdGroup).toHaveAttribute('style', nestedStyle)
    const sashes = Locator('.Main .Sash')
    await expect(sashes).toHaveCount(2)
  }
}
