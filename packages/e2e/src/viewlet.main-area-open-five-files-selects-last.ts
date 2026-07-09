import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-five-files-selects-last'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  for (let i = 1; i <= 5; i++) {
    const file = `${tmpDir}/open-five-${i}.ts`
    await FileSystem.writeFile(file, `export const value = ${i}`)
    await Main.openUri(file)
  }

  const locator1 = Locator('.MainTab')
  await expect(locator1).toHaveCount(5)
  const locator2 = Locator('.MainTabSelected[title$="open-five-5.ts"]')
  await expect(locator2).toBeVisible()
}
