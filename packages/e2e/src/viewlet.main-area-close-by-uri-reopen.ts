import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-by-uri-reopen'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'memfs' })
  const traceUri = `${tmpDir}/performance-trace.json`
  const sourceUri = `${tmpDir}/source.ts`
  await FileSystem.setFiles([
    { content: 'export const source = 1', uri: sourceUri },
    { content: '{"generation":1}', uri: traceUri },
  ])
  const tabs = Locator('.MainTab')
  await Main.openUri(traceUri)
  await Editor.shouldHaveText('{"generation":1}')
  await Main.openUri(sourceUri)
  await Command.execute('Main.closeTabsByUris', [traceUri])
  await FileSystem.writeFile(traceUri, '{"generation":2}')
  await Main.openUri(traceUri)
  await Editor.shouldHaveText('{"generation":2}')
  await expect(tabs).toHaveCount(2)
  await Command.execute('Main.closeTabsByUris', [traceUri])
  await FileSystem.writeFile(traceUri, '{"generation":3}')
  await Main.openUri(traceUri)
  await Editor.shouldHaveText('{"generation":3}')
  await expect(tabs).toHaveCount(2)
}
