import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-two-items'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/open-uris-two-items-1.ts`
  const file2 = `${tmpDir}/open-uris-two-items-2.ts`

  await FileSystem.writeFile(file1, 'export const first = 1')
  await FileSystem.writeFile(file2, 'export const second = 2')

  await Main.openUri(file1)
  await Main.openUri(file2)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
  const tab1 = Locator('.MainTab[title$="open-uris-two-items-1.ts"]')
  await expect(tab1).toBeVisible()
  const tab2 = Locator('.MainTab[title$="open-uris-two-items-2.ts"]')
  await expect(tab2).toBeVisible()
}
