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

test('ignores file and unsupported string items', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystemHandle.getFileHandles'() {
      return [
        undefined,
        {
          kind: 'file',
          type: '',
          value: {},
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
