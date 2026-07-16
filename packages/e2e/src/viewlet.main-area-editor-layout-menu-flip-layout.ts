import type { Test } from '@lvce-editor/test-with-playwright'
import { runEditorLayoutMenuTest } from './shared/editorLayoutMenu.js'

export const name = 'viewlet.main-area-editor-layout-menu-flip-layout'

export const test: Test = async (api) => {
  await runEditorLayoutMenuTest(api, 'flip-layout.txt', 'Flip Layout', 17, async ({ expect, Locator }) => {
    const group = Locator('.EditorGroup')
    await expect(group).toHaveCount(1)
    await expect(group).toHaveAttribute('style', 'width: 100%; height: 100%;')
    await expect(group.locator('.MainTab[title$="flip-layout.txt"]')).toBeVisible()
  })
}
