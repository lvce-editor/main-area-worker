import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-modified-status-change'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const testFile = `${tmpDir}/test.ts`
  const testContent = 'export const hello = () => "world"'
  await FileSystem.writeFile(testFile, testContent)

  // act - open a file
  await Main.openUri(testFile)

  // assert - tab should be visible and not dirty initially
  const tab = Locator('.MainTab[title$="test.ts"]')
  await expect(tab).toBeVisible()
  const tabTitle = Locator('.MainTab[title$="test.ts"] .TabTitle')
  await expect(tabTitle).toHaveText('test.ts')

  // act - mark the file as dirty (modified)
  await Command.execute('Main.handleModifiedStatusChange', testFile, true)

  // assert - tab should show dirty indicator (asterisk)
  await expect(tabTitle).toHaveText('*test.ts')

  // act - mark the file as not dirty (saved)
  await Command.execute('Main.handleModifiedStatusChange', testFile, false)

  // assert - tab should not show dirty indicator
  await expect(tabTitle).toHaveText('test.ts')

  // act - call with a non-existent URI (should not crash)
  const nonExistentUri = `${tmpDir}/does-not-exist.ts`
  await Command.execute('Main.handleModifiedStatusChange', nonExistentUri, true)

  // assert - original tab should still be unaffected
  await expect(tabTitle).toHaveText('test.ts')
  await expect(tab).toBeVisible()
}
