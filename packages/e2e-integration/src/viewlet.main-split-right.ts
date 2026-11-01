import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-split-right'

export const skip = true

export const test: Test = async ({ FileSystem, Main, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`,
  )
  await Workspace.setUri(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)
  await QuickPick.open()
  await QuickPick.setValue('>Split Right')

  // act
  await QuickPick.selectItem('Main: Split Right')

  // assert
  // TODO check that two editors are open now
}
