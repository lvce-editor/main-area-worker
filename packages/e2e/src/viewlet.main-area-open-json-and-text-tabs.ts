import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-json-and-text-tabs'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const jsonFile = `${tmpDir}/data.json`
  const textFile = `${tmpDir}/notes.txt`

  await FileSystem.writeFile(jsonFile, '{"ok": true}')
  await FileSystem.writeFile(textFile, 'hello')

  await Main.openUri(jsonFile)
  await Main.openUri(textFile)

  const jsonTab = Locator('.MainTab[title$="data.json"]')
  await expect(jsonTab).toBeVisible()
  const textTab = Locator('.MainTab[title$="notes.txt"]')
  await expect(textTab).toBeVisible()
  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
}
