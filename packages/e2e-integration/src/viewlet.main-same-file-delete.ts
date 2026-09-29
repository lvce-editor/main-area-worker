import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-same-file-delete'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ reuseExisting: false, uri })
  const editors = Locator('.Editor')

  await Editor.setCursor(0, 3)
  await Editor.deleteCharacterLeft()

  await expect(editors.nth(0)).toHaveText('ab')
  await expect(editors.nth(1)).toHaveText('ab')
}
