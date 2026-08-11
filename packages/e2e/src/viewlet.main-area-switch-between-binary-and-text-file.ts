import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-switch-between-binary-and-text-file'
export const skip = ['webkit'] as const

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const binaryFile = `${tmpDir}/switch.beam`
  const textFile = `${tmpDir}/switch.txt`
  await FileSystem.setFiles([
    { content: 'FOR1BEAMAtU8C', uri: binaryFile },
    { content: 'plain text content', uri: textFile },
  ])
  await Main.openUris([binaryFile, textFile])

  await Editor.shouldHaveText('plain text content')
  await Main.selectTab(0, 0)

  const binaryContent = Locator('.EditorContentBinary')
  await expect(binaryContent).toBeVisible()
  const selectedBinaryTab = Locator('.MainTabSelected[title$="switch.beam"]')
  await expect(selectedBinaryTab).toBeVisible()

  await Main.selectTab(0, 1)

  await Editor.shouldHaveText('plain text content')
}
