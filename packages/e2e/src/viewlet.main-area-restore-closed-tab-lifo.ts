import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-lifo'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const files = [`${tmpDir}/lifo-1.ts`, `${tmpDir}/lifo-2.ts`, `${tmpDir}/lifo-3.ts`]
  await FileSystem.setFiles([
    { content: 'one', uri: files[0] },
    { content: 'two', uri: files[1] },
    { content: 'three', uri: files[2] },
  ])
  await Workspace.setPath(tmpDir)
  for (const file of files) {
    await Main.openUri(file)
  }

  const tabs = Locator('.MainTab')
  const selectedTabTitle = Locator('.MainTabSelected .TabTitle')
  await Main.closeActiveEditor()
  await Main.closeActiveEditor()
  await expect(tabs).toHaveCount(1)

  await Command.execute('Main.restoreClosedTab')
  await expect(tabs).toHaveCount(2)
  await expect(selectedTabTitle).toHaveText('lifo-2.ts')

  await Command.execute('Main.restoreClosedTab')
  await expect(tabs).toHaveCount(3)
  await expect(selectedTabTitle).toHaveText('lifo-3.ts')
}
