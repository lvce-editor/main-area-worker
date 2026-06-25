import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-uris-direct-deduplicates'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/batch-one.ts`
  const file2 = `${tmpDir}/batch-two.ts`

  await FileSystem.writeFile(file1, 'one')
  await FileSystem.writeFile(file2, 'two')

  await Main.openUri(file1)
  await Command.execute('Main.openUris', [file1, file2, file2])

  await expect(Locator('.MainTab[title$="batch-one.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="batch-two.ts"]')).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(2)
}
