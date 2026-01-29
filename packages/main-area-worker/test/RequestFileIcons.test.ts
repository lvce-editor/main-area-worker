import { expect, test } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { IconRequest } from '../src/parts/IconRequest/IconRequest.ts'
import { requestFileIcons } from '../src/parts/RequestFileIcons/RequestFileIcons.ts'

test('requestFileIcons should return empty array for empty input', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => [],
  })
  void mockRpc

  const result = await requestFileIcons([])

  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('requestFileIcons should request icons for single file', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript'],
  })
  void mockRpc

  const requests: IconRequest[] = [{ name: 'index.ts', path: '/src/index.ts', type: 1 }]

  const result = await requestFileIcons(requests)

  expect(result).toEqual(['file-icon-typescript'])
  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'index.ts', type: 1 }]]])
})

test('requestFileIcons should request icons for multiple files', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript', 'file-icon-javascript', 'file-icon-json'],
  })
  void mockRpc

  const requests: IconRequest[] = [
    { name: 'index.ts', path: '/src/index.ts', type: 1 },
    { name: 'utils.js', path: '/src/utils.js', type: 1 },
    { name: 'package.json', path: '/package.json', type: 1 },
  ]

  const result = await requestFileIcons(requests)

  expect(result).toEqual(['file-icon-typescript', 'file-icon-javascript', 'file-icon-json'])
  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'index.ts', type: 1 },
        { name: 'utils.js', type: 1 },
        { name: 'package.json', type: 1 },
      ],
    ],
  ])
})

test('requestFileIcons should convert icon requests using toSimpleIconRequest', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript'],
  })
  void mockRpc

  const requests: IconRequest[] = [
    { name: 'file.ts', path: '/path/to/file.ts', type: 3 }, // Directory type
  ]

  await requestFileIcons(requests)

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'file.ts', type: 2 }]]])
})

test('requestFileIcons should return array of icon strings', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['icon-1', 'icon-2', 'icon-3'],
  })
  void mockRpc

  const requests: IconRequest[] = [
    { name: 'file1.ts', path: '/path/file1.ts', type: 1 },
    { name: 'file2.ts', path: '/path/file2.ts', type: 1 },
    { name: 'file3.ts', path: '/path/file3.ts', type: 1 },
  ]

  const result = await requestFileIcons(requests)

  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBe(3)
  expect(result[0]).toBe('icon-1')
  expect(result[1]).toBe('icon-2')
  expect(result[2]).toBe('icon-3')
})
