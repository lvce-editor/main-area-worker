import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-reopen-image-with-text-editor'
export const skip = ['webkit'] as const

export const test: Test = async ({ ContextMenu, Editor, expect, FileSystem, Locator, Main, QuickPick }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const imageUri = `${tmpDir}/reopen-as-text.svg`
  const content = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
  await FileSystem.writeFile(imageUri, content)
  await Main.openUri(imageUri)

  const image = Locator('img').first()
  await expect(image).toBeVisible()

  await Main.handleTabContextMenu(0, 0, 0)
  const reopenPromise = ContextMenu.selectItem('Reopen Editor With...')
  const textEditorChoice = Locator('.QuickPickItemLabel').first()
  await expect(textEditorChoice).toBeVisible()
  await expect(textEditorChoice).toHaveText('Text Editor')
  await QuickPick.selectItem('Text Editor')
  await reopenPromise
  await Editor.shouldHaveText(content)
}
