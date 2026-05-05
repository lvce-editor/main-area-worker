import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-save-clears-modified-status'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="test.ts"]')
  const modifiedTab = Locator('.MainTabModified[title$="test.ts"]')
  const tabTitle = Locator('.MainTab[title$="test.ts"] .TabTitle')

  await expect(tab).toBeVisible()
  await expect(modifiedTab).toHaveCount(0)
  await expect(tabTitle).toHaveText('test.ts')

  await Editor.setCursor(0, 0)
  await Editor.type('// comment\n')

  await expect(modifiedTab).toHaveCount(1)

  await Main.save()

  await expect(modifiedTab).toHaveCount(0)
  await expect(tabTitle).toHaveText('test.ts')
}
