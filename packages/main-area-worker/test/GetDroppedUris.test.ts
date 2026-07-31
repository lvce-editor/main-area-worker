import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getDroppedUris } from '../src/parts/GetDroppedUris/GetDroppedUris.ts'

const ampDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/amp\.png$/
const indexDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/index\.js$/
const threeDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/three\.txt$/

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

  const uris = await getDroppedUris([1])
  expect(uris).toHaveLength(1)
  expect(uris[0]).toMatch(ampDroppedFileUriRegex)
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1]],
    ['PersistentFileHandle.addHandle', uris[0], fileHandle],
  ])
})

test('uses distinct uris for dropped native files with the same name', async () => {
  const firstFileHandle = {
    kind: 'file',
    name: 'index.js',
  }
  const secondFileHandle = {
    kind: 'file',
    name: 'index.js',
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'file',
          type: '',
          value: firstFileHandle,
        },
        {
          kind: 'file',
          type: '',
          value: secondFileHandle,
        },
      ] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })

  const uris = await getDroppedUris([1, 2])
  expect(uris).toHaveLength(2)
  expect(uris[0]).toMatch(indexDroppedFileUriRegex)
  expect(uris[1]).toMatch(indexDroppedFileUriRegex)
  expect(uris[0]).not.toBe(uris[1])
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1, 2]],
    ['PersistentFileHandle.addHandle', uris[0], firstFileHandle],
    ['PersistentFileHandle.addHandle', uris[1], secondFileHandle],
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

  const uris = await getDroppedUris([1, 2])
  expect(uris.slice(0, 2)).toEqual(['file:///workspace/one.txt', 'file:///workspace/two.txt'])
  expect(uris[2]).toMatch(threeDroppedFileUriRegex)
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
