import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-contents-and-switch'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const names = ['LICENSE', 'README.md', 'GetInspectorProcessId.test.ts']
  const contents = ['license content', '# Readme content', 'export const testValue = 42']
  const files = names.map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles(files.map((uri, index) => ({ content: contents[index], uri })))
  for (let index = 0; index < files.length; index++) {
    await Main.openUri(files[index])
    await Editor.shouldHaveText(contents[index])
  }
  for (let cycle = 0; cycle < 5; cycle++) {
    for (let index = 0; index < files.length; index++) {
      await Main.selectTab(0, index)
      const selectedTab = Locator(`.MainTabSelected[title$="${names[index]}"]`)
      await expect(selectedTab).toBeVisible()
      await Editor.shouldHaveText(contents[index])
    }
  }
}
