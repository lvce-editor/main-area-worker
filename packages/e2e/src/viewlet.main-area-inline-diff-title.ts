import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-inline-diff-title'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  await Main.closeAllEditors()
  const tmpDir = await FileSystem.getTmpDir()
  const workingTreeFile = `${tmpDir}/inline-diff-title.txt`

  await FileSystem.writeFile(workingTreeFile, 'after')

  await Main.openUri(`inline-diff://data://before<->${workingTreeFile}`)

  const tab = Locator('.MainTab')
  const tabTitle = Locator('.MainTab .TabTitle')

  await expect(tab).toBeVisible()
  await expect(tabTitle).toHaveText('inline-diff-title.txt (Working Tree)')
}
