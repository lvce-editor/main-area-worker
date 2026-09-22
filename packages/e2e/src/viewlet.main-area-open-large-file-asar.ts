import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-large-file-asar'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Settings }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  // This valid ASAR fixture contains only ASCII bytes, including its binary header,
  // so the string file-system API preserves the archive exactly.
  const header =
    '\u0004\u0000\u0000\u0000<\u0000\u0000\u00008\u0000\u0000\u00001\u0000\u0000\u0000{"files":{"file.txt":{"size":2816,"offset":"0"}}}\u0000\u0000\u0000'
  const archive = header + 'large archive content '.repeat(128)
  await Settings.update({ 'files.maxFileSizeMB': 0.001 })

  for (const fileName of ['app.asar', 'renamed-archive.txt']) {
    await Main.closeAllEditors()
    const uri = `${tmpDir}/${fileName}`
    await FileSystem.writeFile(uri, archive)
    await Main.openUri(uri)

    const warning = Locator('.EditorContentLargeFile')
    await expect(warning).toContainText('The file is not displayed in the text editor because it is very large')
    await expect(Locator('.EditorContentError:not(.EditorContentLargeFile)')).toHaveCount(0)
    await expect(Locator('.Editor')).toHaveCount(0)
  }

  await Locator('[name="configure-large-file-limit"]').click()
  await expect(Locator('.MainTabSelected')).toContainText('Settings')
}
