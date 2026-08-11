import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-bottom-right-restores-equal-rows'
export const skip = ['webkit'] as const

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  const topFile = `${tmpDir}/top.ts`
  const bottomFile = `${tmpDir}/bottom.ts`
  await FileSystem.setFiles([
    { content: 'top', uri: topFile },
    { content: 'bottom', uri: bottomFile },
  ])

  await Main.openUri(topFile)
  await Main.splitDown()
  await Main.openUri(bottomFile)
  await Main.splitRight()

  const groups = Locator('.EditorGroup')
  const firstGroup = groups.nth(0)
  const secondGroup = groups.nth(1)
  const horizontalContainers = Locator('.editor-groups-container.EditorGroupsHorizontal')
  const verticalContainers = Locator('.editor-groups-container.EditorGroupsVertical')
  const horizontalSashes = Locator('.Main .SashHorizontal')
  const verticalSashes = Locator('.Main .SashVertical')
  await expect(groups).toHaveCount(3)
  await groups.nth(2).locator('.EmptyGroupCloseButton').dispatchEvent('click', clickEventInit)
  await Main.handleClickAction('', '')

  await expect(groups).toHaveCount(2)
  await expect(firstGroup).toHaveAttribute('style', 'height: 50%;')
  await expect(secondGroup).toHaveAttribute('style', 'height: 50%;')
  await expect(horizontalContainers).toHaveCount(1)
  await expect(verticalContainers).toHaveCount(0)
  await expect(horizontalSashes).toHaveCount(1)
  await expect(verticalSashes).toHaveCount(0)
}
