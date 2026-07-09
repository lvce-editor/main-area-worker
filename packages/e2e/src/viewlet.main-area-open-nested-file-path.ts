import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-nested-file-path'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const folder = `${tmpDir}/nested/folder`
  const file = `${tmpDir}/nested/folder/deep-file.ts`

  await FileSystem.mkdir(folder)
  await FileSystem.writeFile(file, 'export const deep = true')
  await Main.openUri(file)

  const tab = Locator('.MainTab[title$="deep-file.ts"]')
  await expect(tab).toBeVisible()
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
}
