import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-same-file-edit-bidirectional'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ reuseExisting: false, uri })
  const editors = Locator('.Editor')

  await editors.nth(0).click()
  await Editor.setCursor(0, 0)
  await Editor.type('left-')
  await editors.nth(1).click()
  await Editor.setCursor(0, 8)
  await Editor.type('-right')

  await expect(editors.nth(0)).toHaveText('left-abc-right')
  await expect(editors.nth(1)).toHaveText('left-abc-right')
}
