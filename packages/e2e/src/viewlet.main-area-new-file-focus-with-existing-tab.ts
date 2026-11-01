import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-new-file-focus-with-existing-tab'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/existing-file.ts`
  await Workspace.setUri(tmpDir)
  await FileSystem.writeFile(testFile, '')
  await Main.openUri(testFile)

  await Command.execute('Main.newFile')

  const untitledTab = Locator('.MainTabSelected[title^="untitled:///"]')
  await expect(untitledTab).toHaveCount(1)

  const editor = Locator('[name="editor"]')
  await expect(editor).toBeFocused()
  await Editor.type('new file beside existing tab')
  await Editor.shouldHaveText('new file beside existing tab')
}
