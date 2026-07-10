import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-empty-groups-hides-last-close-button'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Main.splitRight()
  await Main.splitRight()

  const editorGroups = Locator('.EditorGroup')
  const closeButtons = Locator('.EmptyGroupCloseButton')
  await expect(editorGroups).toHaveCount(3)
  await expect(closeButtons).toHaveCount(3)

  // The runtime expects EventInit, although the current test-worker types declare string.
  const clickEventInit = { bubbles: true } as unknown as string
  await closeButtons.first().dispatchEvent('click', clickEventInit)
  await expect(editorGroups).toHaveCount(2)
  await expect(closeButtons).toHaveCount(2)
  await closeButtons.first().dispatchEvent('click', clickEventInit)

  await expect(editorGroups).toHaveCount(1)
  await expect(closeButtons).toHaveCount(0)
}
