import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-same-file-many-groups-isolate-other-file'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  const otherUri = `${tmpDir}/other.txt`
  await FileSystem.writeFile(uri, 'abc')
  await FileSystem.writeFile(otherUri, 'other')
  await Workspace.setUri(tmpDir)
  await Main.openUri(otherUri)
  await Main.splitRight()
  await Main.openUri(uri)
  await Main.splitDown()
  await Main.openUri({ reuseExisting: false, uri })
  await Main.splitRight()
  await Main.openUri({ reuseExisting: false, uri })
  const editors = Locator('.Editor')
  const sameFileEditors = Locator('.Editor', { hasText: 'abc' })
  const otherFileEditor = Locator('.Editor', { hasText: 'other' })

  await expect(sameFileEditors).toHaveCount(3)
  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await expect(editors).toHaveCount(4)
  await expect(Locator('.Editor', { hasText: 'abcx' })).toHaveCount(3)
  await expect(otherFileEditor).toHaveCount(1)
}
