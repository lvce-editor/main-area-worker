import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateViewlet from '../src/parts/CreateViewlet/CreateViewlet.ts'

test('createViewlet should call Layout.createViewlet with correct parameters', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  await CreateViewlet.createViewlet('test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts')

  expect(mockRpc.invocations).toEqual([['Layout.createViewlet', 'test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts']])
})

test('createViewlet should handle different viewlet module ids', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  await CreateViewlet.createViewlet('editor.text', 5, 10, { height: 200, width: 200, x: 10, y: 10 }, 'file:///path/to/file.ts')

  expect(mockRpc.invocations).toEqual([
    ['Layout.createViewlet', 'editor.text', 5, 10, { height: 200, width: 200, x: 10, y: 10 }, 'file:///path/to/file.ts'],
  ])
})

test('createViewlet should handle different editorUids', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  await CreateViewlet.createViewlet('test.viewlet', 42, 1, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts')

  expect(mockRpc.invocations).toEqual([['Layout.createViewlet', 'test.viewlet', 42, 1, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts']])
})

test('createViewlet should handle different tabIds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  await CreateViewlet.createViewlet('test.viewlet', 1, 99, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts')

  expect(mockRpc.invocations).toEqual([['Layout.createViewlet', 'test.viewlet', 1, 99, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts']])
})

test('createViewlet should handle different bounds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const bounds = { height: 500, width: 500, x: 50, y: 50 }
  await CreateViewlet.createViewlet('test.viewlet', 1, 2, bounds, 'file:///test.ts')

  expect(mockRpc.invocations).toEqual([['Layout.createViewlet', 'test.viewlet', 1, 2, bounds, 'file:///test.ts']])
})

test('createViewlet should handle different uris', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  await CreateViewlet.createViewlet('test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, 'file:///path/to/another/file.js')

  expect(mockRpc.invocations).toEqual([
    ['Layout.createViewlet', 'test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, 'file:///path/to/another/file.js'],
  ])
})

test('createViewlet should be awaitable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const result = await CreateViewlet.createViewlet('test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts')

  expect(result).toBeUndefined()
  expect(mockRpc.invocations).toEqual([['Layout.createViewlet', 'test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, 'file:///test.ts']])
})

test('createViewlet should handle empty uri string', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  await CreateViewlet.createViewlet('test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, '')

  expect(mockRpc.invocations).toEqual([['Layout.createViewlet', 'test.viewlet', 1, 2, { height: 100, width: 100, x: 0, y: 0 }, '']])
})

test('createViewlet should handle null bounds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  await CreateViewlet.createViewlet('test.viewlet', 1, 2, null, 'file:///test.ts')

  expect(mockRpc.invocations).toEqual([['Layout.createViewlet', 'test.viewlet', 1, 2, null, 'file:///test.ts']])
})
