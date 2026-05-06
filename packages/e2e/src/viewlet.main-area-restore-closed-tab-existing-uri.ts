import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-tab-existing-uri'

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/restore-existing-1.ts`
  const file2 = `${tmpDir}/restore-existing-2.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.closeActiveEditor()
  await Main.openUri(file2)
  await Command.execute('Main.restoreClosedTab')

  const savedState = await Main.saveState(2)
  const [group] = savedState.layout.groups
  assert(group.tabs.length === 2, `Expected 2 tabs, got ${group.tabs.length}`)
  assert(group.tabs.filter((tab) => tab.uri === file2).length === 1, `Expected one tab for ${file2}`)

  await expect(Locator('.MainTab')).toHaveCount(2)
  await expect(Locator('.MainTab[title$="restore-existing-2.ts"]')).toHaveCount(1)
  await expect(Locator('.MainTabSelected[title$="restore-existing-2.ts"]')).toBeVisible()
}
