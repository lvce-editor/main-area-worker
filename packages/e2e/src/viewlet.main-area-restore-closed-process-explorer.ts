import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-restore-closed-process-explorer'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Command.execute('Developer.openProcessExplorer')

  const processExplorer = Locator('.ProcessExplorer')
  const selectedTab = Locator('.MainTabSelected[title="Process Explorer"]')
  await expect(processExplorer).toBeVisible()
  await expect(selectedTab).toBeVisible()

  await Main.closeActiveEditor()
  await expect(processExplorer).toHaveCount(0)
  await expect(selectedTab).toHaveCount(0)

  await Command.execute('Main.restoreClosedTab')
  await expect(selectedTab).toBeVisible()
  await expect(processExplorer).toBeVisible()
}
