import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-modified-saved-discard'

export const test: Test = async ({ Dialog, Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'memfs' })
  const testFile = `${tmpDir}/close-discard.txt`
  await FileSystem.writeFile(testFile, 'baseline')
  await Main.openUri(testFile)
  await Editor.setCursor(0, 8)
  await Editor.type('Q')
  await Editor.shouldHaveText('baselineQ')

  const tab = Locator('.MainTab[title$="close-discard.txt"]')
  await expect(tab).toHaveClass('MainTabModified')
  let promptCount = 0
  await Dialog.mockConfirm(() => {
    promptCount++
    return promptCount === 2
  })

  await Main.closeActiveEditor()

  await expect(tab).toBeHidden()
  const diskContent = await FileSystem.readFile(testFile)
  if (diskContent !== 'baseline') {
    throw new Error(`Expected disk content to remain "baseline", got ${JSON.stringify(diskContent)}`)
  }
}
