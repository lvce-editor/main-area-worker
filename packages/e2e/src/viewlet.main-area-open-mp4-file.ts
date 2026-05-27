import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-mp4-file'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.mp4`
  await FileSystem.writeFile(testFile, '')

  await Main.openUri(testFile)

  const tab = Locator('.MainTab[title$="test.mp4"]')
  await expect(tab).toBeVisible()

  const video = Locator('video').first()
  await expect(video).toBeVisible()
}
