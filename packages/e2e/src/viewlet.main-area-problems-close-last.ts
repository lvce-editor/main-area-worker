import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-problems-close-last'

// The static e2e export consumes the latest Main Area and Problems packages.
// Remove after publishing both active-editor changes.
export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Panel, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileUri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(fileUri, 'content')
  await Workspace.setPath(tmpDir)
  await Main.openUri(fileUri)
  await Panel.open('Problems')

  await Main.closeActiveEditor()

  const problemsView = Locator('.Viewlet.Problems')
  await expect(problemsView).toHaveAttribute('data-active-uri', '')
  await expect(problemsView).toHaveText('No problems have been detected in the workspace.')
}
