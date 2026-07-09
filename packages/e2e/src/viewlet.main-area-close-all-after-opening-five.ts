import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-all-after-opening-five'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  for (let i = 1; i <= 5; i++) {
    const file = `${tmpDir}/close-all-five-${i}.ts`
    await FileSystem.writeFile(file, `export const value = ${i}`)
    await Main.openUri(file)
  }

  await Main.closeAllEditors()

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(0)
}
