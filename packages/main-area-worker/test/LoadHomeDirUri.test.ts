import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { loadHomeDirUri } from '../src/parts/LoadHomeDirUri/LoadHomeDirUri.ts'

test('loadHomeDirUri converts an absolute path to a file uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Workspace.getHomeDir': async () => '/home/test',
  })

  await expect(loadHomeDirUri()).resolves.toBe('file:///home/test')
  expect(mockRpc.invocations).toEqual([['Workspace.getHomeDir']])
})

test('loadHomeDirUri preserves file uris', async () => {
  RendererWorker.registerMockRpc({
    'Workspace.getHomeDir': async () => 'file:///home/test',
  })

  await expect(loadHomeDirUri()).resolves.toBe('file:///home/test')
})

test('loadHomeDirUri preserves relative values and handles empty values', async () => {
  RendererWorker.registerMockRpc({
    'Workspace.getHomeDir': async () => 'relative/home',
  })
  await expect(loadHomeDirUri()).resolves.toBe('relative/home')

  RendererWorker.registerMockRpc({
    'Workspace.getHomeDir': async () => '',
  })
  await expect(loadHomeDirUri()).resolves.toBe('')
})

test('loadHomeDirUri handles non-string values and rpc failures', async () => {
  RendererWorker.registerMockRpc({
    'Workspace.getHomeDir': async () => undefined,
  })
  await expect(loadHomeDirUri()).resolves.toBe('')

  RendererWorker.registerMockRpc({
    'Workspace.getHomeDir': async () => {
      throw new Error('failed')
    },
  })
  await expect(loadHomeDirUri()).resolves.toBe('')
})
