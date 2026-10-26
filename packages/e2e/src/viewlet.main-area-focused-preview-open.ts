import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-focused-preview-open'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const first = `${tmpDir}/first.txt`
  const second = `${tmpDir}/second.txt`
  await FileSystem.setFiles([
    { content: 'first file', uri: first },
    { content: 'second file', uri: second },
  ])
  const editor = Locator('[name="editor"]')
  const tabs = Locator('.MainTab')

  for (const [uri, content] of [
    [first, 'first file'],
    [second, 'second file'],
    [second, 'second file'],
  ]) {
    await Main.openInput({ editorInput: { type: 'editor', uri }, focus: true, preview: true })
    await Editor.shouldHaveText(content)
    const selectedTab = Locator(`.MainTabSelected[title="${uri}"]`)
    await expect(editor).toBeFocused()
    await expect(tabs).toHaveCount(1)
    await expect(selectedTab).toBeVisible()
  }
  await Editor.type('edited ')
  await Editor.shouldHaveText('edited second file')
}
