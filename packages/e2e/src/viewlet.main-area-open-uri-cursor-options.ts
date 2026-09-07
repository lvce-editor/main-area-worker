import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uri-cursor-options'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Panel }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/position.txt`
  await FileSystem.writeFile(uri, 'first line\nsecond line\nthird line')
  await Command.execute('Main.openUri', {
    initialCursorPosition: { columnIndex: 0, rowIndex: 1 },
    shouldFocus: true,
    uri,
  })
  await expect(Locator('[name="editor"]')).toBeFocused()
  await Editor.type('new ')
  await Editor.shouldHaveText('first line\nnew second line\nthird line')

  const otherUri = `${tmpDir}/other.txt`
  await FileSystem.writeFile(otherUri, 'other')
  await Main.openUri(otherUri)
  await Command.execute('Main.openUri', {
    initialCursorPosition: { columnIndex: 0, rowIndex: 2 },
    shouldFocus: true,
    uri,
  })
  await expect(Locator('[name="editor"]')).toBeFocused()
  await Editor.type('existing ')
  await Editor.shouldHaveText('first line\nnew second line\nexisting third line')
  await expect(Locator('.MainTab')).toHaveCount(2)

  await Panel.openProblems()
  await Command.execute('Main.openUri', {
    initialCursorPosition: { columnIndex: 0, rowIndex: 0 },
    shouldFocus: false,
    uri,
  })
  await expect(Locator('[name="editor"]')).not.toBeFocused()
}
