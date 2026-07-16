import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-three-columns'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(api, 'three-columns.txt', 'Three Columns', 10, async ({ expect, Locator }) => {
    const groups = Locator('.EditorGroup')
    await expect(groups).toHaveCount(3)
    await expect(groups.nth(0).locator('.MainTab[title$="three-columns.txt"]')).toBeVisible()
    await expect(Locator('.editor-groups-container.EditorGroupsVertical')).toHaveCount(1)
    await expect(Locator('.Main .SashVertical')).toHaveCount(2)
  })
}
