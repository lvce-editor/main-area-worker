import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-status-bar-language-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/App.tsx`, 'export default function App() { return <div /> }')
  await FileSystem.writeFile(`${tmpDir}/settings.json`, '{}')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  const language = Locator('.StatusBarItem[name="EditorLanguage"]')
  await Main.openUri(`${tmpDir}/App.tsx`)
  await expect(language).toHaveText('typescriptreact')
  await Main.openUri(`${tmpDir}/settings.json`)
  await expect(language).toHaveText('json')
  await Main.selectTab(0, 0)
  await expect(language).toHaveText('typescriptreact')
  await Main.selectTab(0, 1)
  await expect(language).toHaveText('json')
  for (let i = 0; i < 3; i++) {
    await Locator('.MainTab[title$="App.tsx"]').click()
    await expect(language).toHaveText('typescriptreact')
    await Locator('.MainTab[title$="settings.json"]').click()
    await expect(language).toHaveText('json')
  }
}
