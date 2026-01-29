import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-three-editors'

export const test: Test = async ({ expect, FileSystem, Keyboard, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`
  await FileSystem.writeFile(file1, 'export const file1 = () => "one"')
  await FileSystem.writeFile(file2, 'export const file2 = () => "two"')
  await FileSystem.writeFile(file3, 'export const file3 = () => "three"')

  // act - open 3 files
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  // assert - verify all tabs are visible
  const tab1 = Locator('.MainTab[title$="file1.ts"]')
  const tab2 = Locator('.MainTab[title$="file2.ts"]')
  const tab3 = Locator('.MainTab[title$="file3.ts"]')
  await expect(tab1).toBeVisible()
  await expect(tab2).toBeVisible()
  await expect(tab3).toBeVisible()

  // act - close all
  await Keyboard.press('ctrl+k ctrl+w')

  // assert - verify all tabs are closed
  await expect(tab1).not.toBeVisible()
  await expect(tab2).not.toBeVisible()
  await expect(tab3).not.toBeVisible()
}
