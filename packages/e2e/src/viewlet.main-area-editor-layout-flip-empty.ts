import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-empty'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutSingle')
  const group = Locator('.EditorGroup')
  const { actual: width } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientWidth' })
  const { actual: height } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientHeight' })
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    await expect(group).toHaveCount(1)
    await expect(group).toHaveJSProperty('clientWidth', width)
    await expect(group).toHaveJSProperty('clientHeight', height)
    const sashes = Locator('.Main .Sash')
    await expect(sashes).toHaveCount(0)
  }
}
