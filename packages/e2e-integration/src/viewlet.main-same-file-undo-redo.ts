import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-same-file-undo-redo'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ reuseExisting: false, uri })
  const editors = Locator('.Editor')

  await Editor.setCursor(0, 3)
  await Editor.type('x')
  await editors.nth(0).click()
  await Command.execute('Editor.undo')
  await expect(editors.nth(0)).toHaveText('abc')
  await expect(editors.nth(1)).toHaveText('abc')
  await Command.execute('Editor.redo')

  await expect(editors.nth(0)).toHaveText('abcx')
  await expect(editors.nth(1)).toHaveText('abcx')
}
