import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-previous-cycles-three-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 3 }, (_, index) => `${tmpDir}/focus-previous-cycle-three-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  for (let i = 0; i < 3; i++) {
    await Main.focusPrevious()
  }

  const locator1 = Locator('.MainTabSelected[title$="focus-previous-cycle-three-3.ts"]')
  await expect(locator1).toBeVisible()
}
