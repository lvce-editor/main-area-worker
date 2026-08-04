import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-after-opening-another'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const first = `${tmpDir}/before.ts`
  const closed = `${tmpDir}/closed.ts`
  const later = `${tmpDir}/later.ts`
  await FileSystem.setFiles([
    { content: 'before', uri: first },
    { content: 'closed', uri: closed },
    { content: 'later', uri: later },
  ])
  await Workspace.setPath(tmpDir)
  await Main.openUri(first)
  await Main.openUri(closed)
  await Main.closeActiveEditor()
  await Main.openUri(later)

  const tabs = Locator('.MainTab')
  await Command.execute('Main.restoreClosedTab')

  await expect(tabs).toHaveCount(3)
  await expect(tabs.nth(0).locator('.TabTitle')).toHaveText('before.ts')
  await expect(tabs.nth(1).locator('.TabTitle')).toHaveText('closed.ts')
  await expect(tabs.nth(2).locator('.TabTitle')).toHaveText('later.ts')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
}
