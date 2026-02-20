import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-nonexistent-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const nonExistentFile = `${tmpDir}/does-not-exist.ts`

  await Main.openUri(nonExistentFile)

  const tab = Locator('.MainTab[title$="does-not-exist.ts"]')
  await expect(tab).toBeVisible()
}
