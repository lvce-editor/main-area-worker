import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-single'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(api, 'single.txt', 'Single', 8, async ({ expect, Locator }) => {
    const group = Locator('.EditorGroup')
    await expect(group).toHaveCount(1)
    await expect(group).toHaveAttribute('style', 'width: 100%;')
    await expect(group.locator('.MainTab[title$="single.txt"]')).toBeVisible()
  })
}
