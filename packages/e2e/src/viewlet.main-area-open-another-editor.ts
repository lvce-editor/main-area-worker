import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-another-editor'

// export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await Main.openUri(file1)

  // act
  await Main.openUri(file2)

  const tab1 = Locator('.MainTab[title$="file1.ts"]')
  await expect(tab1).toBeVisible()
  const tab2 = Locator('.MainTab[title$="file2.ts"]')
  await expect(tab2).toBeVisible()
}
