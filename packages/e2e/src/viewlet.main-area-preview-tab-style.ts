import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-preview-tab-style'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/preview-style.ts`
  await FileSystem.writeFile(file, 'export const preview = true')

  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: file,
    },
    focu: true,
    preview: true,
  })

  const tab = Locator('.MainTab[title$="preview-style.ts"]')
  await expect(tab).toBeVisible()
  await expect(tab).toHaveClass('MainTabPreview')
  await expect(tab).toHaveCSS('font-style', 'italic')
}
