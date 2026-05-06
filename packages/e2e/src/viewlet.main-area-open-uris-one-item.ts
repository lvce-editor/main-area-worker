import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-one-item'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/open-uris-one-item.ts`

  await FileSystem.writeFile(file1, 'export const one = 1')
  await Main.openUri(file1)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(1)
  const tab = Locator('.MainTab[title$="open-uris-one-item.ts"]')
  await expect(tab).toBeVisible()
}
