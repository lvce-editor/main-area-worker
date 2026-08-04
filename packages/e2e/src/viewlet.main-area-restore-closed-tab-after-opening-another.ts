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
  const firstTab = tabs.nth(0)
  const restoredTab = tabs.nth(1)
  const lastTab = tabs.nth(2)
  await Command.execute('Main.restoreClosedTab')

  await expect(tabs).toHaveCount(3)
  await expect(firstTab.locator('.TabTitle')).toHaveText('before.ts')
  await expect(restoredTab.locator('.TabTitle')).toHaveText('closed.ts')
  await expect(lastTab.locator('.TabTitle')).toHaveText('later.ts')
  await expect(restoredTab).toHaveAttribute('aria-selected', 'true')
}
