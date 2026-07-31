import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-open-filename-pnpm-lock'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/pnpm-lock.yaml`
  await FileSystem.writeFile(file, 'lockfileVersion: 9')
  await Main.openUri(file)
  const tab = Locator('.MainTab[title$="pnpm-lock.yaml"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
