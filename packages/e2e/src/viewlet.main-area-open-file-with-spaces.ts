import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-file-with-spaces'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file = `${tmpDir}/file with spaces.ts`

  await FileSystem.writeFile(file, 'export const spaced = true')
  await Main.openUri(file)

  const locator1 = Locator('.MainTab[title$="file with spaces.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(1)
}
