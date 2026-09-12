import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-editor-layout-menu-grid'
export const skip = ['webkit'] as const

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, TitleBarMenuBar }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/grid.txt`
  await FileSystem.writeFile(file, 'editor layout menu test')
  await Main.openUri(file)
  await Command.execute('Timeout.sleep', 200)

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  const editorLayoutMenuItem = Locator('#Menu-0 .MenuItem', { hasText: 'Editor Layout' })
  await expect(editorLayoutMenuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)
  const menuItem = Locator('#Menu-1 .MenuItem', { hasText: 'Grid (2x2)' })
  await expect(menuItem).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 13)

  const { actual: height } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientHeight' })
  const { actual: width } = await Command.execute('TestFrameWork.checkConditionError', 'toHaveJSProperty', Locator('.Main'), { key: 'clientWidth' })
  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const firstGroupTab = firstGroup.locator('.MainTab[title$="grid.txt"]')
  const verticalContainer = Locator('.editor-groups-container.EditorGroupsVertical')
  const horizontalContainers = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const verticalSash = Locator('.Main .SashVertical')
  const horizontalSashes = Locator('.Main .SashHorizontal')
  const sashCorner = Locator('.Main .SashCorner')
  await expect(groups).toHaveCount(4)
  for (let index = 0; index < 4; index++) {
    const group = groups.nth(index)
    await expect(group).toHaveAttribute('style', null)
    await expect(group).toHaveCSS('width', `${width * 0.5}px`)
    await expect(group).toHaveCSS('height', `${height * 0.5}px`)
  }
  for (let index = 0; index < 2; index++) {
    const container = horizontalContainers.nth(index)
    await expect(container).toHaveAttribute('style', null)
    await expect(container).toHaveCSS('width', `${width * 0.5}px`)
    await expect(container).toHaveCSS('height', `${height}px`)
  }
  await expect(firstGroupTab).toBeVisible()
  await expect(verticalContainer).toHaveCount(1)
  await expect(horizontalContainers).toHaveCount(2)
  await expect(verticalSash).toHaveCount(1)
  await expect(horizontalSashes).toHaveCount(2)
  await expect(sashCorner).toBeVisible()
  await expect(sashCorner).toHaveCount(1)
}
