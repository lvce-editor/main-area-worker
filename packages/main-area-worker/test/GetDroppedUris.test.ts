import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getDroppedUris } from '../src/parts/GetDroppedUris/GetDroppedUris.ts'

test('returns no uris when there are no data transfer items', async () => {
  expect(await getDroppedUris([])).toEqual([])
})

test('returns uris from a uri list', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: 'text/uri-list',
          value: 'file:///workspace/one.txt\r\n# ignored comment\r\nfile:///workspace/two.txt\r\n',
        },
        {
          kind: 'string',
          type: 'text/plain',
          value: 'file:///workspace/one.txt',
        },
      ] as any
    },
  })

  expect(await getDroppedUris([1, 2])).toEqual(['file:///workspace/one.txt', 'file:///workspace/two.txt'])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', [1, 2]]])
})

test('persists a dropped native file handle and returns its html uri', async () => {
  const fileHandle = {
    kind: 'file',
    name: 'amp.png',
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'file',
          type: '',
          value: fileHandle,
        },
      ] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })

  expect(await getDroppedUris([1])).toEqual(['html:///dropped-files/amp.png'])
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1]],
    ['PersistentFileHandle.addHandle', 'html:///dropped-files/amp.png', fileHandle],
  ])
})

test('preserves the order of uri lists and native files', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: 'text/uri-list',
          value: 'file:///workspace/one.txt\r\nfile:///workspace/two.txt',
        },
        {
          kind: 'file',
          type: '',
          value: {
            kind: 'file',
            name: 'three.txt',
          },
        },
      ] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })

  expect(await getDroppedUris([1, 2])).toEqual([
    'file:///workspace/one.txt',
    'file:///workspace/two.txt',
    'html:///dropped-files/three.txt',
  ])
})

test('ignores invalid file handles and unsupported string items', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        undefined,
        {
          kind: 'file',
          type: '',
          value: {
            kind: 'directory',
            name: 'folder',
          },
        },
        {
          kind: 'string',
          type: 'text/plain',
          value: 'file:///workspace/file.txt',
        },
      ] as any
    },
  })

  expect(await getDroppedUris([1, 2])).toEqual([])
})

test('returns explorer uris for an opaque Chromium drag id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: '',
          value: '8B1BC632EA890FDD4BDB7705EF0231B0',
        },
      ] as any
    },
    'Viewlet.getDragData'() {
      return {
        items: [
          {
            data: 'file:///workspace/one.txt\nfile:///workspace/two.txt',
            type: 'text/uri-list',
          },
          {
            data: 'file:///workspace/one.txt',
            type: 'text/plain',
          },
        ],
        label: '2',
      }
    },
  })

  expect(await getDroppedUris([1])).toEqual(['file:///workspace/one.txt', 'file:///workspace/two.txt'])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', [1]], ['Viewlet.getDragData']])
})

test('returns no uris when retained drag data is unavailable', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: 'chromium/x-drag-id',
          value: '8B1BC632EA890FDD4BDB7705EF0231B0',
        },
      ] as any
    },
    'Viewlet.getDragData'() {
      return undefined
    },
  })

  expect(await getDroppedUris([1])).toEqual([])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', [1]], ['Viewlet.getDragData']])
})
