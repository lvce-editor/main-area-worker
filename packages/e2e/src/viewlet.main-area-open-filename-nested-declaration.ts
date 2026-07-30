import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-nested-declaration'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/component.test.d.ts`
  await FileSystem.writeFile(file, 'export interface Value {}')
  await Main.openUri(file)
  const tab = Locator('.MainTab[title$="component.test.d.ts"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
