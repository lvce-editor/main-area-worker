import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-bottom-right-restores-equal-columns'
export const skip = ['webkit'] as const

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  const leftFile = `${tmpDir}/left.ts`
  const rightFile = `${tmpDir}/right.ts`
  await FileSystem.setFiles([
    { content: 'left', uri: leftFile },
    { content: 'right', uri: rightFile },
  ])

  await Main.openUri(leftFile)
  await Main.splitRight()
  await Main.openUri(rightFile)
  await Main.splitDown()

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const secondGroup = groups.nth(1)
  const verticalContainers = Locator('.editor-groups-container.EditorGroupsVertical')
  const horizontalContainers = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const verticalSashes = Locator('.Main .SashVertical')
  const horizontalSashes = Locator('.Main .SashHorizontal')
  await expect(groups).toHaveCount(3)
  await groups.nth(2).locator('.EmptyGroupCloseButton').dispatchEvent('click', clickEventInit)
  await Main.handleClickAction('', '')

  await expect(groups).toHaveCount(2)
  await expect(firstGroup).toHaveAttribute('style', 'width: 50%;')
  await expect(secondGroup).toHaveAttribute('style', 'width: 50%;')
  await expect(verticalContainers).toHaveCount(1)
  await expect(horizontalContainers).toHaveCount(0)
  await expect(verticalSashes).toHaveCount(1)
  await expect(horizontalSashes).toHaveCount(0)
}
