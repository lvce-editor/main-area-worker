import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-first-after-opening-many'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  for (let i = 1; i <= 4; i++) {
    const file = `${tmpDir}/select-first-many-${i}.ts`
    await FileSystem.writeFile(file, `export const value = ${i}`)
    await Main.openUri(file)
  }

  await Main.selectTab(0, 0)

  const locator1 = Locator('.MainTabSelected[title$="select-first-many-1.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(4)
}
