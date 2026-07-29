import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-cycles-four-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = Array.from({ length: 4 }, (_, index) => `${tmpDir}/focus-next-cycle-four-${index + 1}.ts`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  await Main.openUris(files)

  for (let i = 0; i < 4; i++) {
    await Main.focusNext()
  }

  const locator1 = Locator('.MainTabSelected[title$="focus-next-cycle-four-4.ts"]')
  await expect(locator1).toBeVisible()
}
