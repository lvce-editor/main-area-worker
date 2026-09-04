import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-legacy-file'

export const skip = ['webkit'] as const

export const test: Test = async ({ Command, DragAndDrop, Editor, expect, Locator, Main }) => {
  const content = 'legacy file dropped from Firefox'
  const file = new File([content], 'firefox-legacy.txt', { type: 'text/plain' })
  const dropId = await DragAndDrop.createDropSession([{ file, kind: 'file', type: file.type }])
  await Main.closeAllEditors()

  await Command.execute('Main.handleDrop', dropId)

  const tab = Locator('.MainTab[title$="firefox-legacy.txt"]')
  await expect(tab).toBeVisible()
  const editor = Locator('.Editor')
  await expect(editor).toBeVisible()
  await Editor.shouldHaveText(content)
}
