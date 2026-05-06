import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uri-and-close-all-at-the-same-time'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const initialFile = `${tmpDir}/initial.txt`
  const racingFile = `${tmpDir}/racing.txt`

  await FileSystem.writeFile(initialFile, 'initial')
  await FileSystem.writeFile(racingFile, 'racing')

  await Main.openUri(initialFile)

  await Promise.all([Main.openUri(racingFile), Main.closeAllEditors()])

  const initialTab = Locator('.MainTab[title$="initial.txt"]')
  const racingTab = Locator('.MainTab[title$="racing.txt"]')
  await expect(initialTab).toBeHidden()
  await expect(racingTab).toBeHidden()
}
