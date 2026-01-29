import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-many-files'

// export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const fileCount = 100

  // Create 100 files
  const files: string[] = []
  for (let i = 0; i < fileCount; i++) {
    const filePath = `${tmpDir}/file-${i}.ts`
    const fileContent = `export const file${i} = () => "content-${i}"`
    await FileSystem.writeFile(filePath, fileContent)
    files.push(filePath)
  }

  // act
  // Open all files
  for (const filePath of files) {
    await Main.openUri(filePath)
  }

  // assert
  // Verify that tabs are created for all files
  for (let i = 0; i < fileCount; i++) {
    const tab = Locator(`.MainTab[title$="file-${i}.ts"]`)
    await expect(tab).toBeVisible()
  }
}
