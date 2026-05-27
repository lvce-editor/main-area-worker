import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-avif-file'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.avif`
  await FileSystem.writeFile(testFile, '')

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="test.avif"]')
  await expect(tab).toBeVisible()

  const image = Locator('img').first()
  await expect(image).toBeVisible()
}
