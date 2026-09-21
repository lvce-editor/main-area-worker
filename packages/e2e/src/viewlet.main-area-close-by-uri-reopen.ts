import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-close-by-uri-reopen'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'memfs' })
  const traceUri = `${tmpDir}/performance-trace.json`
  const sourceUri = `${tmpDir}/source.ts`
  await FileSystem.setFiles([
    { content: 'export const source = 1', uri: sourceUri },
    { content: '{"generation":1}', uri: traceUri },
  ])
  const tabs = Locator('.MainTab')
  const editor = Locator('.Editor')
  await Main.openUri(traceUri)
  await expect(editor).toContainText('{"generation":1}')
  await Main.openUri(sourceUri)
  await Command.execute('Main.closeTabsByUris', [traceUri])
  await FileSystem.writeFile(traceUri, '{"generation":2}')
  await Main.openUri(traceUri)
  await expect(editor).toContainText('{"generation":2}')
  await expect(tabs).toHaveCount(2)
  await Command.execute('Main.closeTabsByUris', [traceUri])
  await FileSystem.writeFile(traceUri, '{"generation":3}')
  await Main.openUri(traceUri)
  await expect(editor).toContainText('{"generation":3}')
  await expect(tabs).toHaveCount(2)
}
