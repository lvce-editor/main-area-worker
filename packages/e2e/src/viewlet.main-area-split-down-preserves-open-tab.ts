import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-down-preserves-open-tab'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Panel, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file = `${tmpDir}/split-down-preserves.ts`

  await FileSystem.writeFile(file, 'export const preserved = true')
  await Main.openUri(file)
  await Panel.open('Problems')
  try {
    await Main.splitDown()

    const locator1 = Locator('.MainTab[title$="split-down-preserves.ts"]')
    await expect(locator1).toBeVisible()
    const locator2 = Locator('.EditorGroup')
    await expect(locator2).toHaveCount(2)
    const locator3 = Locator('.Main .SashHorizontal')
    await expect(locator3).toHaveCount(1)
  } finally {
    await Panel.hide()
  }
}
