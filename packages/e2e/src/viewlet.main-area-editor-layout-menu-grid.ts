import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-grid'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(api, 'grid.txt', 'Grid (2x2)', 13, async ({ expect, Locator }) => {
    const groups = Locator('.EditorGroup')
    await expect(groups).toHaveCount(4)
    await expect(groups.nth(0).locator('.MainTab[title$="grid.txt"]')).toBeVisible()
    await expect(Locator('.editor-groups-container.EditorGroupsVertical')).toHaveCount(1)
    await expect(Locator('.editor-groups-container.EditorGroupsHorizontal')).toHaveCount(2)
    await expect(Locator('.Main .SashVertical')).toHaveCount(1)
    await expect(Locator('.Main .SashHorizontal')).toHaveCount(2)
  })
}
