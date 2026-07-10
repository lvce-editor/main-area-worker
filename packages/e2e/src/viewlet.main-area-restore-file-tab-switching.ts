import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-file-tab-switching'

export const skip = 1

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const firstFile = `${tmpDir}/restore-switch-first.ts`
  const secondFile = `${tmpDir}/restore-switch-second.ts`
  await FileSystem.writeFile(firstFile, 'first file')
  await FileSystem.writeFile(secondFile, 'second file')

  await Main.openUri(firstFile)
  await Main.openUri(secondFile)

  await Command.execute('Window.reload')

  const firstTab = Locator('.MainTab[title$="restore-switch-first.ts"]')
  const secondTab = Locator('.MainTab[title$="restore-switch-second.ts"]')
  await expect(firstTab).toBeVisible()
  await expect(secondTab).toBeVisible()

  await Main.selectTab(0, 0)

  const selectedFirstTab = Locator('.MainTabSelected[title$="restore-switch-first.ts"]')
  await expect(selectedFirstTab).toBeVisible()
  await Editor.shouldHaveText('first file')
}
