import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-restore-three-rows'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setUri(tmpDir)
  const files = ['top.ts', 'middle.ts', 'bottom.ts'].map((name) => `${tmpDir}/${name}`)
  await FileSystem.setFiles([
    { content: 'top content', uri: files[0] },
    { content: 'middle content', uri: files[1] },
    { content: 'bottom content', uri: files[2] },
  ])

  await Main.openUri(files[0])
  await Main.splitDown()
  await Main.openUri(files[1])
  await Main.splitDown()
  await Main.openUri(files[2])

  await Command.execute('Reload.reload')

  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(3)
  await expect(Locator('.Main .Sash')).toHaveCount(2)
  await expect(editors.nth(0)).toHaveText('top content')
  await expect(editors.nth(1)).toHaveText('middle content')
  await expect(editors.nth(2)).toHaveText('bottom content')
  await expect(Locator('.Main')).not.toContainText('undefined')

  await Main.selectTab(0, 0)
  await Editor.shouldHaveText('top content')
}
