import { expect, test } from '@jest/globals'
import { MessagePortRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CacheStorageClient from '../src/parts/CacheStorageClient/CacheStorageClient.ts'

test('initialize routes Cache Worker RPC through the renderer worker relay', async () => {
  const previousRpc = CacheStorageClient.set(undefined)
  using _restoreCacheWorker = {
    [Symbol.dispose]: () => {
      CacheStorageClient.set(previousRpc)
    },
  }
  let cacheWorkerRpc: Awaited<ReturnType<typeof MessagePortRpcClient.create>> | undefined
  using _mockRendererWorker = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToCacheWorker': async (port: MessagePort) => {
      cacheWorkerRpc = await MessagePortRpcClient.create({
        commandMap: {
          'Cache.getCacheStorageItem': async (key: string, cacheName: string) => ({
            body: new TextEncoder().encode(`${cacheName}:${key}`).buffer,
          }),
        },
        messagePort: port,
      })
    },
  })

  await CacheStorageClient.initialize()

  await expect(CacheStorageClient.invoke('Cache.getCacheStorageItem', 'key', 'lvce0main-area-tabs')).resolves.toEqual({
    body: new TextEncoder().encode('lvce0main-area-tabs:key').buffer,
  })

  await cacheWorkerRpc?.dispose()
})
