import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reopen-image-with-text-editor'
export const skip = ['webkit'] as const

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main }) => {
  const dispatchPointerDownWhenReady = async (locator: ReturnType<typeof Locator>): Promise<void> => {
    const eventInit = { bubbles: true, clientX: 200, clientY: 100, pointerId: 1 } as any
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        await locator.dispatchEvent('pointerdown', eventInit)
        return
      } catch {
        await new Promise(requestAnimationFrame)
      }
    }
    await locator.dispatchEvent('pointerdown', eventInit)
  }

  const extensionUri = import.meta.resolve('../fixtures/reopen-editor-media-preview')
  await Extension.addWebExtension(extensionUri)

  const tmpDir = await FileSystem.getTmpDir()
  const imageUri = `${tmpDir}/reopen-as-text.svg`
  const content = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
  await FileSystem.writeFile(imageUri, content)
  await Main.openUri(imageUri)

  const image = Locator('img').first()
  await expect(image).toBeVisible()

  const reopenPromise = Command.execute('Main.reopenEditorWith')
  const textEditorChoice = Locator('.QuickPickItem').first()
  await dispatchPointerDownWhenReady(textEditorChoice)
  await reopenPromise
  await Editor.shouldHaveText(content)

  const reopenAsImagePromise = Command.execute('Main.reopenEditorWith')
  const mediaPreviewChoice = Locator('.QuickPickItem', { hasText: 'Media Preview' }).first()
  await dispatchPointerDownWhenReady(mediaPreviewChoice)
  await reopenAsImagePromise

  await Command.execute('Main.reopenEditorWith', 'editor')
  await Editor.shouldHaveText(content)
}
