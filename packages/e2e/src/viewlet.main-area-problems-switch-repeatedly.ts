import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-problems-switch-repeatedly'

// The static e2e export consumes the latest published Main Area package.
// Remove after publishing the active-editor notification from this change.
export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Panel, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const firstUri = `${tmpDir}/first.txt`
  const secondUri = `${tmpDir}/second.txt`
  const thirdUri = `${tmpDir}/third.txt`
  await FileSystem.setFiles([
    { content: 'first', uri: firstUri },
    { content: 'second', uri: secondUri },
    { content: 'third', uri: thirdUri },
  ])
  await Workspace.setPath(tmpDir)
  await Main.openUri(firstUri)
  await Main.openUri(secondUri)
  await Main.openUri(thirdUri)
  await Panel.open('Problems')
  const problemsView = Locator('.Viewlet.Problems')

  await Main.focusPrevious()
  await expect(problemsView).toHaveAttribute('data-active-uri', secondUri)
  await Main.focusPrevious()
  await expect(problemsView).toHaveAttribute('data-active-uri', firstUri)
  await Main.focusNext()
  await expect(problemsView).toHaveAttribute('data-active-uri', secondUri)
  await Main.focusNext()
  await expect(problemsView).toHaveAttribute('data-active-uri', thirdUri)
}
