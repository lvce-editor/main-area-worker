import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { getLargeFileSize } from '../src/parts/GetLargeFileSize/GetLargeFileSize.ts'

test('returns the size when a file exceeds the configured limit', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => 2 * 1024 * 1024,
    'Preferences.get': async () => 1,
  })

  await expect(getLargeFileSize({ type: 'editor', uri: 'file:///large.txt' })).resolves.toBe(2 * 1024 * 1024)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.getFileSize', 'file:///large.txt'],
    ['Preferences.get', 'files.maxFileSizeMB'],
  ])
})

test('allows a file at the configured limit', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => 1024 * 1024,
    'Preferences.get': async () => 1,
  })

  await expect(getLargeFileSize({ type: 'editor', uri: 'file:///allowed.txt' })).resolves.toBeUndefined()
})

test('uses the default limit when the preference is unavailable', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => 51 * 1024 * 1024,
    'Preferences.get': async () => {
      throw new Error('unavailable')
    },
  })

  await expect(getLargeFileSize({ type: 'editor', uri: 'file:///large.txt' })).resolves.toBe(51 * 1024 * 1024)
})

test('uses the default limit when the configured limit is invalid', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => 51 * 1024 * 1024,
    'Preferences.get': async () => 0,
  })

  await expect(getLargeFileSize({ type: 'editor', uri: 'file:///large.txt' })).resolves.toBe(51 * 1024 * 1024)
})

test('allows an explicitly forced large file without statting it', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  await expect(getLargeFileSize({ type: 'editor', uri: 'file:///large.txt' }, true)).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([])
})

test('retains existing open behavior when file size is unavailable', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.getFileSize': async () => {
      throw new Error('unsupported')
    },
  })

  await expect(getLargeFileSize({ type: 'editor', uri: 'file:///file.txt' })).resolves.toBeUndefined()
})

test('does not stat non-file inputs', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  await expect(getLargeFileSize({ type: 'editor', uri: 'memory://file.txt' })).resolves.toBeUndefined()
  expect(mockRpc.invocations).toEqual([])
})
