import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save'

export const skip = 1

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/save-test.ts`
  const initialContent = 'export const initial = "content"'
  const updatedContent = 'export const updated = "new content"'

  // Write initial file to disk
  await FileSystem.writeFile(testFile, initialContent)

  // Open the editor
  await Main.openUri(testFile)
  await Editor.shouldHaveText(initialContent)

  // Edit the file
  // @ts-ignore
  await Editor.setAllText(updatedContent)
  await Editor.shouldHaveText(updatedContent)

  // Save the file
  // @ts-ignore
  await Main.save()

  // Close the file
  // @ts-ignore
  await Main.closeActiveTab()

  // Reopen the file
  await Main.openUri(testFile)

  // Verify the updated content is present
  await Editor.shouldHaveText(updatedContent)
}
