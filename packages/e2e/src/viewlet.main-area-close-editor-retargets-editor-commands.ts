import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-editor-retargets-editor-commands'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const workspaceFile = `${tmpDir}/workspace-file.txt`
  const closedFile = `${tmpDir}/closed-file.json`
  await FileSystem.setFiles([
    { content: 'workspace content', uri: workspaceFile },
    { content: '{"closed":true}', uri: closedFile },
  ])

  await Main.openUri(workspaceFile)
  await Editor.shouldHaveText('workspace content')
  await Main.openUri(closedFile)
  await Editor.shouldHaveText('{"closed":true}')

  await Main.closeActiveEditor()
  const editorContent = Locator('.EditorContent')
  await expect(editorContent).toBeVisible()
  await Command.execute('Editor.selectAll')
  await Editor.type('updated workspace content')
  await Main.save()

  await FileSystem.shouldHaveFile(workspaceFile, 'updated workspace content')
  await FileSystem.shouldHaveFile(closedFile, '{"closed":true}')
}
