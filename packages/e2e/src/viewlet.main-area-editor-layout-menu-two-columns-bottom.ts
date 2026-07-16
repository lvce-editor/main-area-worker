import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-two-columns-bottom'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(api, 'two-columns-bottom.txt', 'Two Columns Bottom', 15, async ({ expect, Locator }) => {
    const groups = Locator('.EditorGroup')
    await expect(groups).toHaveCount(3)
    await expect(groups.nth(0).locator('.MainTab[title$="two-columns-bottom.txt"]')).toBeVisible()
    await expect(Locator('.editor-groups-container.EditorGroupsHorizontal')).toHaveCount(1)
    await expect(Locator('.editor-groups-container.EditorGroupsVertical')).toHaveCount(1)
    await expect(Locator('.Main .SashHorizontal')).toHaveCount(1)
    await expect(Locator('.Main .SashVertical')).toHaveCount(1)
  })
}
