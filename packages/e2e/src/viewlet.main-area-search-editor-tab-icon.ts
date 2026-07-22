import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-search-editor-tab-icon'

export const test: Test = async ({ expect, Locator, Main }) => {
  const uri = 'search-editor://42-123/Search'

  await Main.openUri(uri)

  const tab = Locator(`.MainTab[title="${uri}"]`)
  await expect(tab).toBeVisible()
  const icon = tab.locator('.TabIcon .MaskIconSearch')
  await expect(icon).toBeVisible()
}
