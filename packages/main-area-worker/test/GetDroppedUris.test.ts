import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getDroppedUris } from '../src/parts/GetDroppedUris/GetDroppedUris.ts'

const ampDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/1\/amp\.png$/
const directDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/2\/direct\.txt$/
const droppedFolderUriRegex = /^html:\/\/\/dropped-files\/\d+\/2\/folder\/$/
const firstDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/1\/first\.txt$/
const firstIndexDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/1\/index\.js$/
const meetingNotesDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/1\/meeting notes\.txt$/
const secondDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/2\/second\.txt$/
const secondIndexDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/2\/index\.js$/
const threeDroppedFileUriRegex = /^html:\/\/\/dropped-files\/\d+\/2\/three\.txt$/

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
  expect(uris[0]).toMatch(firstIndexDroppedFileUriRegex)
  expect(uris[1]).toMatch(secondIndexDroppedFileUriRegex)
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

test('persists a dropped native directory handle', async () => {
  const directoryHandle = {
    kind: 'directory',
    name: 'folder',
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'file',
          type: '',
          value: directoryHandle,
        },
      ] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })

  const uris = await getDroppedUris([2])
  expect(uris).toHaveLength(1)
  expect(uris[0]).toEqual(expect.stringMatching(droppedFolderUriRegex))
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [2]],
    ['PersistentFileHandle.addHandle', uris[0], directoryHandle],
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
            kind: 'unsupported',
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

  expect(await getDroppedUris([1, 2, 3])).toEqual([])
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

test('forwards every native data transfer item id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return []
    },
  })

  expect(await getDroppedUris([3, 5, 8])).toEqual([])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', [3, 5, 8]]])
})

test('preserves spaces in a dropped native file name', async () => {
  const fileHandle = {
    kind: 'file',
    name: 'meeting notes.txt',
  }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'file', type: 'text/plain', value: fileHandle }] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })

  const uris = await getDroppedUris([1])
  expect(uris).toHaveLength(1)
  expect(uris[0]).toMatch(meetingNotesDroppedFileUriRegex)
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1]],
    ['PersistentFileHandle.addHandle', uris[0], fileHandle],
  ])
})

test('persists multiple native files in drop order', async () => {
  const firstHandle = { kind: 'file', name: 'first.txt' }
  const secondHandle = { kind: 'file', name: 'second.txt' }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        { kind: 'file', type: '', value: firstHandle },
        { kind: 'file', type: '', value: secondHandle },
      ] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })

  const uris = await getDroppedUris([1, 2])
  expect(uris).toHaveLength(2)
  expect(uris[0]).toMatch(firstDroppedFileUriRegex)
  expect(uris[1]).toMatch(secondDroppedFileUriRegex)
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1, 2]],
    ['PersistentFileHandle.addHandle', uris[0], firstHandle],
    ['PersistentFileHandle.addHandle', uris[1], secondHandle],
  ])
})

test('trims whitespace and comments from a native uri list', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        {
          kind: 'string',
          type: 'text/uri-list',
          value: '  # copied from explorer  \r\n  file:///workspace/one.txt  \r\n\r\n file:///workspace/two.txt ',
        },
      ] as any
    },
  })

  expect(await getDroppedUris([1])).toEqual(['file:///workspace/one.txt', 'file:///workspace/two.txt'])
})

test('parses line-feed separated native explorer uris', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: 'text/uri-list', value: 'file:///workspace/a.ts\nfile:///workspace/b.ts\nfile:///workspace/c.ts' }] as any
    },
  })

  expect(await getDroppedUris([1])).toEqual(['file:///workspace/a.ts', 'file:///workspace/b.ts', 'file:///workspace/c.ts'])
})

test('does not request retained explorer data when a native uri list is available', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        { kind: 'string', type: '', value: '8B1BC632EA890FDD4BDB7705EF0231B0' },
        { kind: 'string', type: 'text/uri-list', value: 'file:///workspace/direct.txt' },
      ] as any
    },
  })

  expect(await getDroppedUris([1, 2])).toEqual(['file:///workspace/direct.txt'])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', [1, 2]]])
})

test('does not request retained explorer data when a native file is available', async () => {
  const fileHandle = { kind: 'file', name: 'direct.txt' }
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        { kind: 'string', type: 'chromium/x-drag-id', value: '8B1BC632EA890FDD4BDB7705EF0231B0' },
        { kind: 'file', type: '', value: fileHandle },
      ] as any
    },
    'PersistentFileHandle.addHandle'() {},
  })

  const uris = await getDroppedUris([1, 2])
  expect(uris).toHaveLength(1)
  expect(uris[0]).toMatch(directDroppedFileUriRegex)
  expect(mockRpc.invocations).toEqual([
    ['FileSystemHandle.getFileHandles', [1, 2]],
    ['PersistentFileHandle.addHandle', uris[0], fileHandle],
  ])
})

test('accepts a lowercase opaque Chromium drag id from explorer', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: 'chromium/x-drag-id', value: '8b1bc632ea890fdd4bdb7705ef0231b0' }] as any
    },
    'Viewlet.getDragData'() {
      return {
        items: [{ data: 'file:///workspace/lowercase.txt', type: 'text/uri-list' }],
      }
    },
  })

  expect(await getDroppedUris([1])).toEqual(['file:///workspace/lowercase.txt'])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', [1]], ['Viewlet.getDragData']])
})

test('ignores an invalid opaque Chromium drag id without requesting retained data', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: 'chromium/x-drag-id', value: 'not-a-valid-drag-id' }] as any
    },
  })

  expect(await getDroppedUris([1])).toEqual([])
  expect(mockRpc.invocations).toEqual([['FileSystemHandle.getFileHandles', [1]]])
})

test('ignores retained explorer drag data with a malformed items field', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: '', value: '8B1BC632EA890FDD4BDB7705EF0231B0' }] as any
    },
    'Viewlet.getDragData'() {
      return { items: 'file:///workspace/file.txt' }
    },
  })

  expect(await getDroppedUris([1])).toEqual([])
})

test('combines supported retained explorer uri lists and ignores other retained item types', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [{ kind: 'string', type: '', value: '8B1BC632EA890FDD4BDB7705EF0231B0' }] as any
    },
    'Viewlet.getDragData'() {
      return {
        items: [
          { data: '# first group\nfile:///workspace/one.txt', type: 'text/uri-list' },
          { data: 'file:///workspace/ignored.txt', type: 'text/plain' },
          { data: 'file:///workspace/two.txt\nfile:///workspace/three.txt', type: 'text/uri-list' },
        ],
      }
    },
  })

  expect(await getDroppedUris([1])).toEqual(['file:///workspace/one.txt', 'file:///workspace/two.txt', 'file:///workspace/three.txt'])
})
