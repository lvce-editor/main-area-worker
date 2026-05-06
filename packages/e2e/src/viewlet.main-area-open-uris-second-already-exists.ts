import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-second-already-exists'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/open-uris-second-existing-1.ts`
  const file2 = `${tmpDir}/open-uris-second-existing-2.ts`

  await FileSystem.writeFile(file1, 'export const first = 1')
  await FileSystem.writeFile(file2, 'export const alreadyThere = 2')

  await Main.openUri(file2)
  await Main.openUri(file1)
  await Main.openUri(file2)

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
  const file1Tab = Locator('.MainTab[title$="open-uris-second-existing-1.ts"]')
  await expect(file1Tab).toHaveCount(1)
  const file2Tab = Locator('.MainTab[title$="open-uris-second-existing-2.ts"]')
  await expect(file2Tab).toHaveCount(1)
  const selectedTab = Locator('.MainTabSelected[title$="open-uris-second-existing-2.ts"]')
  await expect(selectedTab).toBeVisible()
}
