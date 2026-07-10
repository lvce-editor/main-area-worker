import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-process-explorer-tab-switching'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/process-explorer-tab-switching.txt`
  await FileSystem.writeFile(testFile, 'text file content')
  await Main.openUri(testFile)

  const processExplorerTab = Locator('.MainTab[title="Process Explorer"]')
  const textFileTab = Locator('.MainTab[title$="process-explorer-tab-switching.txt"]')
  await expect(processExplorerTab).toBeVisible()
  await expect(textFileTab).toBeVisible()

  await Command.execute('Window.reload')

  await expect(processExplorerTab).toBeVisible()
  await expect(textFileTab).toBeVisible()

  // act
  await Main.selectTab(0, 0)

  // assert
  const selectedProcessExplorerTab = Locator('.MainTabSelected[title="Process Explorer"]')
  const processExplorer = Locator('.ProcessExplorer')
  await expect(selectedProcessExplorerTab).toBeVisible()
  await expect(processExplorer).toBeVisible()
}
