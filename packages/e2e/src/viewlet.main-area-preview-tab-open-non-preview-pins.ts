import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-preview-tab-open-non-preview-pins'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstFile = `${tmpDir}/pin-existing-first.ts`
  const secondFile = `${tmpDir}/pin-existing-second.ts`
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
      uri: firstFile,
    },
    focu: true,
    preview: false,
  })

  const firstTab = Locator('.MainTab:not(.MainTabPreview)[title$="pin-existing-first.ts"]')
  await expect(firstTab).toBeVisible()

  await Main.openInput({
    editorInput: {
      type: 'editor',
      uri: secondFile,
    },
    focu: true,
    preview: true,
  })

  const secondTab = Locator('.MainTabPreview[title$="pin-existing-second.ts"]')
  const tabs = Locator('.MainTab')
  await expect(firstTab).toBeVisible()
  await expect(secondTab).toBeVisible()
  await expect(tabs).toHaveCount(2)
}
