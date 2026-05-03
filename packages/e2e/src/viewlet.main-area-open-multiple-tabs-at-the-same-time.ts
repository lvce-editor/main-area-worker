import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-multiple-tabs-at-the-same-time'
export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/file1.txt`
  const file2 = `${tmpDir}/file2.txt`
  const file3 = `${tmpDir}/file3.txt`
  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')

  await Promise.all([Main.openUri(file1), Main.openUri(file2), Main.openUri(file3)])

  await expect(Locator('.MainTab[title$="file1.txt"]')).toHaveCount(1)
  await expect(Locator('.MainTab[title$="file2.txt"]')).toHaveCount(1)
  await expect(Locator('.MainTab[title$="file3.txt"]')).toHaveCount(1)
}
