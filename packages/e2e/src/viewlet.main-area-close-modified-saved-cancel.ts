import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-modified-saved-cancel'

export const test: Test = async ({ Dialog, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/close-cancel.txt`
  await FileSystem.writeFile(testFile, 'baseline')
  await Workspace.setPath(tmpDir)
  await Main.openUri(testFile)
  await Editor.setCursor(0, 8)
  await Editor.type('Q')
  await Editor.shouldHaveText('baselineQ')

  const tab = Locator('.MainTab[title$="close-cancel.txt"]')
  await expect(tab).toHaveClass('MainTabModified')
  await Dialog.mockConfirm(() => false)

  await Main.closeActiveEditor()

  await expect(tab).toBeVisible()
  await Editor.shouldHaveText('baselineQ')
  const diskContent = await FileSystem.readFile(testFile)
  if (diskContent !== 'baseline') {
    throw new Error(`Expected disk content to remain "baseline", got ${JSON.stringify(diskContent)}`)
  }
}
