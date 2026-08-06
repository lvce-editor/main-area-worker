import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-drop-legacy-file'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main }) => {
  const content = 'legacy file dropped from Firefox'
  const file = new File([content], 'firefox-legacy.txt', { type: 'text/plain' })
  const itemId = await FileSystem.registerFileHandle({ kind: 'file-legacy', type: file.type, value: file } as any)
  await Main.closeAllEditors()

  await Command.execute('Main.handleDrop', [itemId])

  const tab = Locator('.MainTab[title$="firefox-legacy.txt"]')
  await expect(tab).toBeVisible()
  await Editor.shouldHaveText(content)
}
