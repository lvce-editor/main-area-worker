import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-two-columns'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(
    api,
    'two-columns.txt',
    'Two Columns',
    9,
    async ({ expect, Locator }) => {
      const groups = Locator('.EditorGroup')
      await expect(groups).toHaveCount(2)
      await expect(groups.nth(0)).toHaveAttribute('style', 'width: 50%;')
      await expect(groups.nth(0).locator('.MainTab[title$="two-columns.txt"]')).toBeVisible()
      await expect(groups.nth(1)).toHaveAttribute('style', 'width: 50%;')
      await expect(Locator('.editor-groups-container.EditorGroupsVertical')).toHaveCount(1)
      await expect(Locator('.Main .SashVertical')).toHaveCount(1)
    },
    0,
  )
}
