import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-diff-nonexistent-files'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  const leftFile = `${tmpDir}/left-does-not-exist.ts`
  const rightFile = `${tmpDir}/right-does-not-exist.ts`
  const leftUri = `file://${leftFile}`
  const rightUri = `file://${rightFile}`
  const diffUri = `diff://${leftUri}<->${rightUri}`

  await Main.openUri(diffUri)

  const tab = Locator('.MainTab')
  await expect(tab).toBeVisible()

  const leftErrorMessage = Locator('.DiffEditorContentLeft .DiffEditorErrorMessage')
  const rightErrorMessage = Locator('.DiffEditorContentRight .DiffEditorErrorMessage')
  await expect(leftErrorMessage).toBeVisible()
  await expect(rightErrorMessage).toBeVisible()
  await expect(leftErrorMessage).toHaveText(`Failed to read file "${leftUri}": TypeError: Invalid URL`)
  await expect(rightErrorMessage).toHaveText(`Failed to read file "${rightUri}": TypeError: Invalid URL`)
}
