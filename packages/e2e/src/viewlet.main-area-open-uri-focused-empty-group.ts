import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uri-focused-empty-group'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const readme = `${tmpDir}/README.md`
  const openedInFocusedGroup = `${tmpDir}/opened-in-focused-group.ts`

  await Workspace.setPath(tmpDir)
  await FileSystem.setFiles([
    { content: '# README', uri: readme },
    { content: 'export const value = true', uri: openedInFocusedGroup },
  ])

  await Main.closeAllEditors()
  await Main.openUri(readme)
  await Command.execute('Main.splitLeft')

  const groups = Locator('.EditorGroup')
  const leftGroup = groups.nth(0)
  await expect(leftGroup).toBeVisible()
  await leftGroup.dispatchEvent('focus', {} as any)

  await Main.openUri(openedInFocusedGroup)

  const leftTab = groups.nth(0).locator(`.MainTab[title$="opened-in-focused-group.ts"]`)
  const rightTab = groups.nth(1).locator(`.MainTab[title$="README.md"]`)
  await expect(leftTab).toBeVisible()
  await expect(rightTab).toBeVisible()
}
