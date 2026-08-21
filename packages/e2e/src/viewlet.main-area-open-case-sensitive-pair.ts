import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-case-sensitive-pair'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const upper = `${tmpDir}/CaseEdge.ts`
  const lower = `${tmpDir}/caseedge.ts`
  await FileSystem.setFiles([
    { content: 'export const upper = true', uri: upper },
    { content: 'export const lower = true', uri: lower },
  ])

  await Main.openUris([upper, lower])

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
  const upperTab = Locator('.MainTab[title$="CaseEdge.ts"]')
  await expect(upperTab).toHaveCount(1)
  const lowerTab = Locator('.MainTab[title$="caseedge.ts"]')
  await expect(lowerTab).toHaveCount(1)
}
