import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-same-file-three-groups-horizontal'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setUri(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ reuseExisting: false, uri })
  await Main.splitRight()
  await Main.openUri({ reuseExisting: false, uri })
  const editors = Locator('.Editor')

  await editors.nth(1).click()
  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await expect(editors).toHaveCount(3)
  for (let index = 0; index < 3; index++) {
    await expect(editors.nth(index)).toHaveText('abcx')
  }
}
