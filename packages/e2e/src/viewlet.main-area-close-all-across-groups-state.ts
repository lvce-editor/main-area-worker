import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-across-groups-state'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const file1 = `${tmpDir}/close-all-left.ts`
  const file2 = `${tmpDir}/close-all-right.ts`

  await FileSystem.writeFile(file1, 'left')
  await FileSystem.writeFile(file2, 'right')

  await Main.openUri(file1)
  await Main.splitRight()
  await Main.openUri(file2)
  await Command.execute('Main.closeAll')

  await expect(Locator('.MainTab')).toHaveCount(0)
}
