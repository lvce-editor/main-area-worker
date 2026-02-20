import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-nonexistent-file'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const nonExistentFile = `${tmpDir}/does-not-exist.ts`

  await Main.openUri(nonExistentFile)

  const tab = Locator('.MainTab[title$="does-not-exist.ts"]')
  await expect(tab).toBeVisible()

  const errorContent = Locator('.EditorContent--error')
  await expect(errorContent).toBeVisible()
  await expect(errorContent).toContainText('File not found')

  const retryButton = Locator('.EditorContent--error .Button')
  await expect(retryButton).toBeVisible()
  await expect(retryButton).toHaveText('Retry')
}
