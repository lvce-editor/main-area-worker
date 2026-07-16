import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-preview-tab-replaced'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstFile = `${tmpDir}/preview-first.ts`
  const secondFile = `${tmpDir}/preview-second.ts`
  await FileSystem.setFiles([
    { content: 'export const first = true', uri: firstFile },
    { content: 'export const second = true', uri: secondFile },
  ])

  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: firstFile,
    },
    focu: true,
    preview: true,
  })
  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: secondFile,
    },
    focu: true,
    preview: true,
  })

  const firstTab = Locator('.MainTab[title$="preview-first.ts"]')
  const secondTab = Locator('.MainTabPreview[title$="preview-second.ts"]')
  const tabs = Locator('.MainTab')
  await expect(firstTab).toBeHidden()
  await expect(secondTab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
