import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reopen-image-with-text-editor'
export const skip = ['webkit'] as const

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const imageUri = `${tmpDir}/reopen-as-text.svg`
  const content = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
  await FileSystem.writeFile(imageUri, content)
  await Main.openUri(imageUri)

  const image = Locator('img').first()
  await expect(image).toBeVisible()

  const reopenPromise = Command.execute('Main.reopenEditorWith')
  await new Promise((resolve) => setTimeout(resolve, 500))
  const textEditorChoice = Locator('.QuickPickItem').first()
  await textEditorChoice.dispatchEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 100, pointerId: 1 } as any)
  await reopenPromise
  await Editor.shouldHaveText(content)
}
