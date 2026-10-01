import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-preview-tab-modified-pins'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstFile = `${tmpDir}/modified-preview-first.ts`
  const secondFile = `${tmpDir}/modified-preview-second.ts`
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

  await Main.handleModifiedStatusChange(firstFile, true)

  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: secondFile,
    },
    focu: true,
    preview: true,
  })

  const secondTab = Locator('.MainTabPreview[title$="modified-preview-second.ts"]')
  const pinnedFirstTab = Locator('.MainTab:not(.MainTabPreview)[title$="modified-preview-first.ts"]')
  const tabs = Locator('.MainTab')
  await expect(pinnedFirstTab).toBeVisible()
  await expect(pinnedFirstTab).toHaveClass('MainTabModified')
  await expect(secondTab).toBeVisible()
  await expect(tabs).toHaveCount(2)
}
