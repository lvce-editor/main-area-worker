import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-up-close-lower-group'

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('MainArea.splitUp')

  const editorGroups = Locator('.EditorGroup')
  const closeButtons = Locator('.EmptyGroupCloseButton')
  const lowerGroupCloseButton = editorGroups.nth(1).locator('.EmptyGroupCloseButton')
  await expect(editorGroups).toHaveCount(2)
  await expect(closeButtons).toHaveCount(2)
  await lowerGroupCloseButton.dispatchEvent('click', clickEventInit)

  await expect(editorGroups).toHaveCount(1)
  await expect(Locator('.MainTab')).toHaveCount(0)
  await expect(closeButtons).toHaveCount(0)
}
