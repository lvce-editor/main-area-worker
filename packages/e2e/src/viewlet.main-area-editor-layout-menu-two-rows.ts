import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-two-rows'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(
    api,
    'two-rows.txt',
    'Two Rows',
    11,
    async ({ expect, Locator }) => {
      const groups = Locator('.EditorGroup')
      await expect(groups).toHaveCount(2)
      await expect(groups.nth(0)).toHaveAttribute('style', 'height: 50%;')
      await expect(groups.nth(0).locator('.MainTab[title$="two-rows.txt"]')).toBeVisible()
      await expect(groups.nth(1)).toHaveAttribute('style', 'height: 50%;')
      await expect(Locator('.editor-groups-container.EditorGroupsHorizontal')).toHaveCount(1)
      await expect(Locator('.Main .SashHorizontal')).toHaveCount(1)
    },
    0,
  )
}
