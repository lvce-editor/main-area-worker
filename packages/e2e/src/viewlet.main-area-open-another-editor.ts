import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-another-editor'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')

  // Open first editor
  await Main.openUri(file1)
  await Main.openUri(file2)

  await Editor.shouldHaveText('content2')
}
