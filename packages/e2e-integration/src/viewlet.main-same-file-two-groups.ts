import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-same-file-two-groups'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setUri(tmpDir)

  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ reuseExisting: false, uri })

  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(2)
  await expect(editors.nth(0)).toHaveText('abc')
  await expect(editors.nth(1)).toHaveText('abc')
  await Editor.shouldHaveText('abc')
}
