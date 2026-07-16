import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-split-left'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(api, 'split-left.txt', 'Split Left', 2, async ({ expect, Locator }) => {
    const groups = Locator('.EditorGroup')
    await expect(groups).toHaveCount(2)
    await expect(groups.nth(0).locator('.MainTab')).toHaveCount(0)
    await expect(groups.nth(1).locator('.MainTab[title$="split-left.txt"]')).toBeVisible()
    await expect(Locator('.editor-groups-container.EditorGroupsVertical')).toHaveCount(1)
    await expect(Locator('.Main .SashVertical')).toHaveCount(1)
  })
}
