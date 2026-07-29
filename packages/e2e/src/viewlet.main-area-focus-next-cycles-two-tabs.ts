import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focus-next-cycles-two-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [`${tmpDir}/focus-next-cycle-two-1.ts`, `${tmpDir}/focus-next-cycle-two-2.ts`]
  await FileSystem.setFiles(files.map((uri, index) => ({ content: `export const value = ${index}`, uri })))
  for (const file of files) {
    await Main.openUri(file)
  }

  await Main.focusNext()
  await Main.focusNext()

  const locator1 = Locator('.MainTabSelected[title$="focus-next-cycle-two-2.ts"]')
  await expect(locator1).toBeVisible()
}
