import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-same-file-one-hundred-groups-horizontal'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)
  for (let index = 1; index < 100; index++) {
    await Main.splitRight()
    await Main.openUri({ reuseExisting: false, uri })
  }
  const editors = Locator('.Editor')

  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await expect(editors).toHaveCount(100)
  for (let index = 0; index < 100; index++) {
    await expect(editors.nth(index)).toHaveText('abcx')
  }
}
