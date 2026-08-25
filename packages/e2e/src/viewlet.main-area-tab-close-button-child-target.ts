import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-tab-close-button-child-target'

const clickEventInit = { bubbles: true } as unknown as string

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file1 = `${tmpDir}/close-child-target-1.ts`
  const file2 = `${tmpDir}/close-child-target-2.ts`
  const file3 = `${tmpDir}/close-child-target-3.ts`
  await FileSystem.setFiles([
    { content: 'one', uri: file1 },
    { content: 'two', uri: file2 },
    { content: 'three', uri: file3 },
  ])
  await Main.openUri(file1)
  await Main.openUri(file2)
  await Main.openUri(file3)

  const tabs = Locator('.MainTab')
  const waitForTabCount = async (count: number): Promise<void> => {
    for (let attempt = 0; attempt < 60; attempt++) {
      try {
        await expect(tabs).toHaveCount(count)
        return
      } catch {
        await new Promise(requestAnimationFrame)
      }
    }
    await expect(tabs).toHaveCount(count)
  }
  await expect(tabs).toHaveCount(3)

  const inactiveCloseIcon = Locator('.MainTab[title$="close-child-target-1.ts"] .EditorTabCloseButton .MaskIconClose')
  await inactiveCloseIcon.dispatchEvent('click', clickEventInit)
  await waitForTabCount(2)
  const firstTab = Locator('.MainTab[title$="close-child-target-1.ts"]')
  const selectedThirdTab = Locator('.MainTabSelected[title$="close-child-target-3.ts"]')
  await expect(firstTab).toBeHidden()
  await expect(selectedThirdTab).toBeVisible()

  const activeCloseIcon = Locator('.MainTabSelected[title$="close-child-target-3.ts"] .EditorTabCloseButton .MaskIconClose')
  await activeCloseIcon.dispatchEvent('click', clickEventInit)
  await waitForTabCount(1)
  const thirdTab = Locator('.MainTab[title$="close-child-target-3.ts"]')
  const selectedSecondTab = Locator('.MainTabSelected[title$="close-child-target-2.ts"]')
  await expect(thirdTab).toBeHidden()
  await expect(selectedSecondTab).toBeVisible()
}
