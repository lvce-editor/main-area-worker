import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-grid'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Main.setEditorLayoutGrid')
  const groups = Locator('.EditorGroup')
  const { actual: width } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientWidth' })
  const { actual: height } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientHeight' })
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    await expect(groups).toHaveCount(4)
    for (let index = 0; index < 4; index++) {
      const group = groups.nth(index)
      await expect(group).toHaveJSProperty('clientWidth', Math.round(width / 2))
      await expect(group).toHaveJSProperty('clientHeight', Math.round(height / 2))
    }
    const sashes = Locator('.Main .Sash')
    await expect(sashes).toHaveCount(3)
  }
}
