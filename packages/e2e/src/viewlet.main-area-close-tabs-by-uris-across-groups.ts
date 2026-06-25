import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-tabs-by-uris-across-groups'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/keep-left.ts`
  const file2 = `${tmpDir}/remove-left.ts`
  const file3 = `${tmpDir}/remove-right.ts`
  const file4 = `${tmpDir}/keep-right.ts`

  await FileSystem.writeFile(file1, 'keep left')
  await FileSystem.writeFile(file2, 'remove left')
  await FileSystem.writeFile(file3, 'remove right')
  await FileSystem.writeFile(file4, 'keep right')

  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.splitRight()
  await Main.openUri(file3)
  await Main.openUri(file4)

  await Command.execute('Main.closeTabsByUris', [file2, file3])

  await expect(Locator('.MainTab[title$="keep-left.ts"]')).toBeVisible()
  await expect(Locator('.MainTab[title$="remove-left.ts"]')).toBeHidden()
  await expect(Locator('.MainTab[title$="remove-right.ts"]')).toBeHidden()
  await expect(Locator('.MainTab[title$="keep-right.ts"]')).toBeVisible()
  await expect(Locator('.MainTab')).toHaveCount(2)
}
