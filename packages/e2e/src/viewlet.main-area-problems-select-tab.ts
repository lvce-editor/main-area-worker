import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-problems-select-tab'

// The static e2e export consumes the latest published Main Area package.
// Remove after publishing the active-editor notification from this change.
export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Panel, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstUri = `${tmpDir}/first.txt`
  const secondUri = `${tmpDir}/second.txt`
  await FileSystem.setFiles([
    { content: 'first', uri: firstUri },
    { content: 'second', uri: secondUri },
  ])
  await Workspace.setPath(tmpDir)
  await Main.openUri(firstUri)
  await Main.openUri(secondUri)
  await Panel.open('Problems')

  await Main.selectTab(0, 0)

  const problemsView = Locator('.Viewlet.Problems')
  await expect(problemsView).toHaveAttribute('data-active-uri', firstUri)
}
