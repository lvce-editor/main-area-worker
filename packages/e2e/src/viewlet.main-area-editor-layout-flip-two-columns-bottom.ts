import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-two-columns-bottom'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutTwoColumnsBottom')
  const groups = Locator('.EditorGroup')
  const nested = Locator('.Main .editor-groups-container .editor-groups-container')
  const { actual: width } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientWidth' })
  const { actual: height } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientHeight' })
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    const horizontal = flip % 2 === 0
    await expect(groups).toHaveCount(3)
    const firstGroup = groups.nth(0)
    await expect(firstGroup).toHaveJSProperty('clientWidth', Math.round(horizontal ? width / 2 : width))
    await expect(firstGroup).toHaveJSProperty('clientHeight', Math.round(horizontal ? height : height / 2))
    await expect(nested).toHaveCount(1)
    await expect(nested).toHaveJSProperty('clientWidth', Math.round(horizontal ? width / 2 : width))
    await expect(nested).toHaveJSProperty('clientHeight', Math.round(horizontal ? height : height / 2))
    const secondGroup = groups.nth(1)
    await expect(secondGroup).toHaveJSProperty('clientWidth', Math.round(width / 2))
    await expect(secondGroup).toHaveJSProperty('clientHeight', Math.round(height / 2))
    const thirdGroup = groups.nth(2)
    await expect(thirdGroup).toHaveJSProperty('clientWidth', Math.round(width / 2))
    await expect(thirdGroup).toHaveJSProperty('clientHeight', Math.round(height / 2))
    const sashes = Locator('.Main .Sash')
    await expect(sashes).toHaveCount(2)
  }
}
