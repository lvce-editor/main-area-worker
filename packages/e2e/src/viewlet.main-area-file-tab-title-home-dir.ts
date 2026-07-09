import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-file-tab-title-home-dir'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const homeDir = await FileSystem.getTmpDir()
  await Workspace.setPath(homeDir)
  await (Workspace as any).setHomeDir(homeDir)
  const file = `${homeDir}/some/path.md`

  await FileSystem.writeFile(file, '# test')
  await Main.openUri(file)

  const tab = Locator('.MainTab[title="~/some/path.md"]')
  await expect(tab).toBeVisible()
}
