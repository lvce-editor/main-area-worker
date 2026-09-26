import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-two-rows'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutTwoRows')
  const groups = Locator('.EditorGroup')
  const { actual: width } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientWidth' })
  const { actual: height } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientHeight' })
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    const horizontal = flip % 2 === 0
    await expect(groups).toHaveCount(2)
    for (let index = 0; index < 2; index++) {
      const group = groups.nth(index)
      await expect(group).toHaveJSProperty('clientWidth', Math.round(horizontal ? width / 2 : width))
      await expect(group).toHaveJSProperty('clientHeight', Math.round(horizontal ? height : height / 2))
    }
    const sashes = Locator('.Main .Sash')
    await expect(sashes).toHaveCount(1)
  }
}
