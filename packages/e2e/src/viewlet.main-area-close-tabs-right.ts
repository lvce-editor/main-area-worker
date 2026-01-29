import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-tabs-right'

// export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/file1.ts`
  const file2 = `${tmpDir}/file2.ts`
  const file3 = `${tmpDir}/file3.ts`

  await FileSystem.writeFile(file1, 'content1')
  await FileSystem.writeFile(file2, 'content2')
  await FileSystem.writeFile(file3, 'content3')

  // act - open 3 editors
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  // assert - all 3 tabs are visible
  const tab1 = Locator('.MainTab[title$="file1.ts"]')
  const tab2 = Locator('.MainTab[title$="file2.ts"]')
  const tab3 = Locator('.MainTab[title$="file3.ts"]')
  await expect(tab1).toBeVisible()
  await expect(tab2).toBeVisible()
  await expect(tab3).toBeVisible()

  // act - select second tab and close tabs to the right
  await tab2.click()
  await tab2.click({
    button: 'right',
  })
  // TODO: implement close tabs right context menu action

  // assert - only file1 and file2 remain
  // await expect(tab1).toBeVisible()
  // await expect(tab2).toBeVisible()
  // await expect(tab3).not.toBeVisible()
}
