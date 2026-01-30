import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-empty-group'

export const test: Test = async ({ FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  // Open file
  await Main.openUri(testFile)

  // TODO: Add assertions for split functionality
}
