import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-status-bar-language-tabs'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'statusBar.itemsVisible': true })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'export default function App() { return <div /> }', uri: `${tmpDir}/App.tsx` },
    { content: '{}', uri: `${tmpDir}/settings.json` },
  ])
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
    await Command.execute('Main.handleClickTab', '0', '0', 0)
    await expect(language).toHaveText('typescriptreact')
    await Command.execute('Main.handleClickTab', '0', '1', 0)
    await expect(language).toHaveText('json')
  }
}
