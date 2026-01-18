import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accessibility'
export const skip = true

export const test: Test = async ({ FileSystem }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/languages`)
  await FileSystem.mkdir(`${tmpDir}/sample-folder`)
}
