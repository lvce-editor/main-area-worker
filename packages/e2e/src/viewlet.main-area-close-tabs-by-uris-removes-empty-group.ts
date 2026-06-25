import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-tabs-by-uris-removes-empty-group'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/keep-only.ts`
  const file2 = `${tmpDir}/remove-only-right.ts`

  await FileSystem.writeFile(file1, 'keep')
  await FileSystem.writeFile(file2, 'remove')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.openUri(file2)
  await Command.execute('Main.closeTabsByUris', [file2])

  await expect(Locator('.MainTab[title$="keep-only.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="remove-only-right.ts"]')).toBeHidden()
  await expect(Locator('.MainTab')).toHaveCount(1)
}
