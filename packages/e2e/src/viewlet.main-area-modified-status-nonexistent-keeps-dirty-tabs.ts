import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-modified-status-nonexistent-keeps-dirty-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/dirty-real.ts`
  const missingFile = `${tmpDir}/dirty-missing.ts`

  await FileSystem.writeFile(file1, 'real')

  await Main.openUri(file1)
  await Main.handleModifiedStatusChange(file1, true)
  await Main.handleModifiedStatusChange(missingFile, false)

  await expect(Locator('.MainTabModified[title$="dirty-real.ts"]')).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
