import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-select-middle-after-opening-many'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  for (let i = 1; i <= 5; i++) {
    const file = `${tmpDir}/select-middle-many-${i}.ts`
    await FileSystem.writeFile(file, `export const value = ${i}`)
    await Main.openUri(file)
  }

  await Main.selectTab(0, 2)

  const locator1 = Locator('.MainTabSelected[title$="select-middle-many-3.ts"]')
  await expect(locator1).toBeVisible()
  const locator2 = Locator('.MainTab')
  await expect(locator2).toHaveCount(5)
}
