import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-others-state'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-others-1.ts`
  const file2 = `${tmpDir}/close-others-2.ts`
  const file3 = `${tmpDir}/close-others-3.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')
  await FileSystem.writeFile(file3, 'three')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)
  await Main.selectTab(0, 1)
  await Command.execute('Main.closeOthers')

  await expect(Locator('.MainTab[title$="close-others-1.ts"]')).toBeHidden()
  await expect(Locator('.MainTab[title$="close-others-2.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="close-others-3.ts"]')).toBeHidden()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
