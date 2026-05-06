import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-same-and-different-uris-at-the-same-time'
export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const sharedFile = `${tmpDir}/shared.txt`
  const otherFile = `${tmpDir}/other.txt`

  await FileSystem.writeFile(sharedFile, 'shared')
  await FileSystem.writeFile(otherFile, 'other')

  await Promise.all([Main.openUri(sharedFile), Main.openUri(sharedFile), Main.openUri(otherFile)])

  const sharedTab = Locator('.MainTab[title$="shared.txt"]')
  const otherTab = Locator('.MainTab[title$="other.txt"]')
  await expect(sharedTab).toHaveCount(1)
  await expect(otherTab).toHaveCount(1)
}
