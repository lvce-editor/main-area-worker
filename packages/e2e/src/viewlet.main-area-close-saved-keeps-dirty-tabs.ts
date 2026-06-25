import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-saved-keeps-dirty-tabs'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-saved-clean-1.ts`
  const file2 = `${tmpDir}/close-saved-dirty.ts`
  const file3 = `${tmpDir}/close-saved-clean-2.ts`

  await FileSystem.writeFile(file1, 'clean one')
  await FileSystem.writeFile(file2, 'dirty')
  await FileSystem.writeFile(file3, 'clean two')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  await Main.handleModifiedStatusChange(file2, true)

  await Command.execute('Main.closeSaved')

  await expect(Locator('.MainTab[title$="close-saved-clean-1.ts"]')).toBeHidden()
  await expect(Locator('.MainTab[title$="close-saved-dirty.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="close-saved-clean-2.ts"]')).toBeHidden()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
