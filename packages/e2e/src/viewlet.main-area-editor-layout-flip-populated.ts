import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-flip-populated'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const first = `${tmpDir}/first.txt`
  const second = `${tmpDir}/second.txt`
  await FileSystem.writeFile(first, 'first editor')
  await FileSystem.writeFile(second, 'second editor')
  await Main.openUri(first)
  await Main.splitRight()
  await Main.openUri(second)
  const groups = Locator('.EditorGroup')
  await expect(groups).toHaveCount(2)
  await expect(groups.nth(0).locator('.Editor')).toBeVisible()
  await expect(groups.nth(1).locator('.Editor')).toBeVisible()
  for (let flip = 0; flip < 4; flip++) {
    await Command.execute('Main.flipEditorLayout')
    const style = flip % 2 === 0 ? 'width: 100%; height: 50%;' : 'width: 50%; height: 100%;'
    await expect(groups).toHaveCount(2)
    await expect(groups.nth(0)).toHaveAttribute('style', style)
    await expect(groups.nth(1)).toHaveAttribute('style', style)
    await expect(groups.nth(0).locator('.MainTab[title$="first.txt"]')).toBeVisible()
    await expect(groups.nth(1).locator('.MainTab[title$="second.txt"]')).toBeVisible()
    await expect(groups.nth(0).locator('.Editor')).toBeVisible()
    await expect(groups.nth(1).locator('.Editor')).toBeVisible()
  }
}
