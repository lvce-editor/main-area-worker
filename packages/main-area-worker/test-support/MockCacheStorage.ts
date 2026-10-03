import { expect } from '@jest/globals'
import * as CacheStorageClient from '../src/parts/CacheStorageClient/CacheStorageClient.ts'

export const mockCacheStorage = (handlers: {
  getJson?: (key: string) => unknown
  remove?: (key: string) => boolean
  setJson?: (key: string, value: unknown) => unknown
}) => {
  const invocations: unknown[][] = []
  const previous = CacheStorageClient.set({
    dispose: async () => {},
    invoke: async (command: string, ...args: readonly unknown[]) => {
      invocations.push([command, ...args])
      const key = args[0] as string
      const value = args[1] as string | undefined
      const cacheName = (command === 'Cache.setCacheStorageItem' ? args[2] : args[1]) as string | undefined
      const headers = args[3] as Record<string, string> | undefined
      if (['Cache.getCacheStorageItem', 'Cache.setCacheStorageItem', 'Cache.removeCacheStorageItem'].includes(command)) {
        expect(cacheName).toBe('lvce0main-area-tabs')
      }
      if (command === 'Cache.getCacheStorageItem') {
        const json = handlers.getJson?.(key)
        if (json === undefined) {
          return null
        }
        return { body: new TextEncoder().encode(JSON.stringify(json)).buffer }
      }
      if (command === 'Cache.setCacheStorageItem') {
        expect(headers?.['Content-Type']).toBe('application/json')
        expect(Date.parse(headers?.Expires ?? '')).toBeGreaterThan(Date.now())
        const result = handlers.setJson?.(key, JSON.parse(value!))
        return result === undefined ? { success: true } : result
      }
      if (command === 'Cache.removeCacheStorageItem') {
        return handlers.remove ? handlers.remove(key) : true
      }
      throw new Error(`Unexpected cache worker command: ${command} (${cacheName}, ${JSON.stringify(headers)})`)
    },
    invokeAndTransfer: async () => undefined,
    send: () => {},
  })
  return {
    invocations,
    [Symbol.dispose]: () => {
      CacheStorageClient.set(previous)
    },
  }
}
