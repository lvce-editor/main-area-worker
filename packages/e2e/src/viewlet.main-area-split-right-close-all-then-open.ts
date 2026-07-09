import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-close-all-then-open'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/split-close-open-1.ts`
  const file2 = `${tmpDir}/split-close-open-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.closeAllEditors()
  await Main.openUri(file2)

  const tab = Locator('.MainTab[title$="split-close-open-2.ts"]')
  await expect(tab).toBeVisible()
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
