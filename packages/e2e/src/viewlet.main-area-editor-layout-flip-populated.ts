import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-populated'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings }) => {
  await Main.closeAllEditors()
  // Use the system font so this layout regression does not depend on downloadable fonts.
  await Settings.update({ 'editor.fontFamily': 'monospace' })
  try {
    const tmpDir = await FileSystem.getTmpDir()
    const first = `${tmpDir}/first.txt`
    const second = `${tmpDir}/second.txt`
    await FileSystem.setFiles([
      { content: 'first editor', uri: first },
      { content: 'second editor', uri: second },
    ])
    await Main.openUri(first)
    await Main.splitRight()
    await Main.openUri(second)
    const groups = Locator('.EditorGroup')
    await expect(groups).toHaveCount(2)
    const firstEditor = groups.nth(0).locator('.Editor')
    await expect(firstEditor).toBeVisible()
    const secondEditor = groups.nth(1).locator('.Editor')
    await expect(secondEditor).toBeVisible()
    const { actual: width } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientWidth' })
    const { actual: height } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), {
      key: 'clientHeight',
    })
    for (let flip = 0; flip < 4; flip++) {
      await Command.execute('Main.flipEditorLayout')
      const horizontal = flip % 2 === 1
      await expect(groups).toHaveCount(2)
      const firstGroup = groups.nth(0)
      await expect(firstGroup).toHaveJSProperty('clientWidth', Math.round(horizontal ? width / 2 : width))
      await expect(firstGroup).toHaveJSProperty('clientHeight', Math.round(horizontal ? height : height / 2))
      const secondGroup = groups.nth(1)
      await expect(secondGroup).toHaveJSProperty('clientWidth', Math.round(horizontal ? width / 2 : width))
      await expect(secondGroup).toHaveJSProperty('clientHeight', Math.round(horizontal ? height : height / 2))
      const firstTab = groups.nth(0).locator('.MainTab[title$="first.txt"]')
      await expect(firstTab).toBeVisible()
      const secondTab = groups.nth(1).locator('.MainTab[title$="second.txt"]')
      await expect(secondTab).toBeVisible()
      await expect(firstEditor).toBeVisible()
      await expect(secondEditor).toBeVisible()
    }
  } finally {
    await Main.closeAllEditors()
    await Settings.update({ 'editor.fontFamily': 'Fira Code' })
  }
}
