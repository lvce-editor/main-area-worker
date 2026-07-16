import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-preview-tab-double-click-pins'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstFile = `${tmpDir}/double-click-first.ts`
  const secondFile = `${tmpDir}/double-click-second.ts`
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

  const firstTab = Locator('.MainTab[title$="double-click-first.ts"]')
  await firstTab.dispatchEvent('dblclick', { bubbles: true } as any)
  await expect(firstTab).not.toHaveClass('MainTabPreview')

  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: secondFile,
    },
    focu: true,
    preview: true,
  })

  const secondTab = Locator('.MainTabPreview[title$="double-click-second.ts"]')
  const tabs = Locator('.MainTab')
  await expect(firstTab).toBeVisible()
  await expect(secondTab).toBeVisible()
  await expect(tabs).toHaveCount(2)
}
