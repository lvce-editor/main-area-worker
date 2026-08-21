import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-sibling-files-with-same-basename'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const folder1 = `${tmpDir}/first`
  const folder2 = `${tmpDir}/second`
  const file1 = `${folder1}/same.ts`
  const file2 = `${folder2}/same.ts`
  await FileSystem.mkdir(folder1)
  await FileSystem.mkdir(folder2)
  await FileSystem.setFiles([
    { content: 'export const first = true', uri: file1 },
    { content: 'export const second = true', uri: file2 },
  ])

  await Main.openUris([file1, file2])

  const titles = Locator('.MainTab .TabTitle')
  await expect(titles).toHaveCount(2)
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
}
