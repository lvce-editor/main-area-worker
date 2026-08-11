import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-binary-file'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/restored.beam`
  await FileSystem.writeFile(file, 'FOR1BEAMAtU8C')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)

  await Main.closeActiveEditor()
  await Command.execute('Main.restoreClosedTab')

  const restoredTab = Locator('.MainTabSelected[title$="restored.beam"]')
  await expect(restoredTab).toBeVisible()
  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toHaveText('The file is not displayed in the text editor because its contents are binary.Open in Text Editor')
}
