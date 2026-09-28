import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-large-file-asar'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  // This valid ASAR fixture contains only ASCII bytes, including its binary header,
  // so the string file-system API preserves the archive exactly.
  const header =
    '\u{4}\u{0}\u{0}\u{0}<\u{0}\u{0}\u{0}8\u{0}\u{0}\u{0}1\u{0}\u{0}\u{0}{"files":{"file.txt":{"size":2816,"offset":"0"}}}\u{0}\u{0}\u{0}'
  const archive = header + 'large archive content '.repeat(128)
  await Settings.update({ 'files.maxFileSizeMB': 0.001 })

  for (const fileName of ['app.asar', 'renamed-archive.txt']) {
    await Main.closeAllEditors()
    const uri = `${tmpDir}/${fileName}`
    await FileSystem.writeFile(uri, archive)
    await Main.openUri(uri)

    const warning = Locator('.EditorContentLargeFile')
    await expect(warning).toContainText('The file is not displayed in the text editor because it is very large')
    const errors = Locator('.EditorContentError:not(.EditorContentLargeFile)')
    await expect(errors).toHaveCount(0)
    const editors = Locator('.Editor')
    await expect(editors).toHaveCount(0)
  }

  await Command.execute('Main.handleClickAction', 'configure-large-file-limit')
  const selectedTab = Locator('.MainTabSelected')
  await expect(selectedTab).toContainText('Settings')
}
