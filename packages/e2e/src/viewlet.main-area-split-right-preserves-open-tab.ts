import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-preserves-open-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file = `${tmpDir}/split-right-preserves.ts`

  await FileSystem.writeFile(file, 'export const preserved = true')
  await Main.openUri(file)
  await Main.splitRight()

  const locator1 = Locator('.MainTab[title$="split-right-preserves.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.EditorGroup')
  await expect(locator2).toHaveCount(2)
  const locator3 = Locator('.Main .SashVertical')
  await expect(locator3).toHaveCount(1)
}
