import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-three-rows'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(api, 'three-rows.txt', 'Three Rows', 12, async ({ expect, Locator }) => {
    const groups = Locator('.EditorGroup')
    await expect(groups).toHaveCount(3)
    await expect(groups.nth(0).locator('.MainTab[title$="three-rows.txt"]')).toBeVisible()
    await expect(Locator('.editor-groups-container.EditorGroupsHorizontal')).toHaveCount(1)
    await expect(Locator('.Main .SashHorizontal')).toHaveCount(2)
  })
}
