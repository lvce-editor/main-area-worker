import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-sash-vertical'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')

  await Main.openUri(file1)
  await Command.execute('Main.splitDown')

  const sash = Locator('.SashHorizontal')
  await expect(sash).toBeVisible()
  await expect(sash).toHaveCount(1)
}
