import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-editors-at-the-same-time'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-all-1.txt`
  const file2 = `${tmpDir}/close-all-2.txt`

  await FileSystem.writeFile(file1, 'file1')
  await FileSystem.writeFile(file2, 'file2')

  await Main.openUri(file1)
  await Main.openUri(file2)

  await Promise.all([Main.closeAllEditors(), Main.closeAllEditors()])

  const tab1 = Locator('.MainTab[title$="close-all-1.txt"]')
  const tab2 = Locator('.MainTab[title$="close-all-2.txt"]')
  await expect(tab1).toBeHidden()
  await expect(tab2).toBeHidden()
}
