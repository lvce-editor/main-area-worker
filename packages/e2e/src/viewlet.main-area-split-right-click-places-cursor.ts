import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-right-click-places-cursor'

export const test: Test = async ({ Editor, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const leftFile = `${tmpDir}/split-right-click-left.txt`
  const rightFile = `${tmpDir}/split-right-click-right.txt`
  await FileSystem.setFiles([
    { content: 'left', uri: leftFile },
    { content: 'abcdefghij', uri: rightFile },
  ])
  await Main.openUri(leftFile)
  await Main.splitRight()
  await Main.openUri(rightFile)

  const rightEditorToken = Locator('.EditorGroup').nth(1).locator('.EditorRow span').first()
  // eslint-disable-next-line e2e/no-direct-click -- Clicking the rendered right editor is the regression behavior under test.
  await rightEditorToken.click()

  await Editor.shouldHaveSelections(new Uint32Array([0, 5, 0, 5]))
}
