import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/save-test.ts`
  const initialContent = 'export const initial = "content"'
  const updatedContent = 'abcexport const initial = "content"'

  // Write initial file to disk
  await FileSystem.writeFile(testFile, initialContent)

  // Open the editor
  await Main.openUri(testFile)
  await Editor.shouldHaveText(initialContent)

  // Edit the file
  await Editor.setCursor(0, 0)
  await Editor.type('abc')

  // Save the file
  await Main.save()

  // Close the file
  await Main.closeActiveEditor()

  // Reopen the file
  await Main.openUri(testFile)

  // Verify the updated content is present
  await Editor.shouldHaveText(updatedContent)
}
