import { expect } from '@jest/globals'

export const mockCacheStorage = (handlers: { getJson?: (key: string) => unknown; setJson?: (key: string, value: unknown) => unknown }) => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'caches')
  const invocations: unknown[][] = []
  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: {
      open: async (name: string) => {
        expect(name).toBe('lvce0main-area-tabs')
        return {
          match: async (key: string) => {
            invocations.push(['getJson', key])
            const value = handlers.getJson?.(key)
            return value === undefined ? undefined : Response.json(value)
          },
          put: async (key: string, response: Response) => {
            expect(response.headers.get('Content-Type')).toBe('application/json')
            expect(Date.parse(response.headers.get('Expires')!)).toBeGreaterThan(Date.now())
            const value: unknown = await response.json()
            invocations.push(['setJson', key, value])
            handlers.setJson?.(key, value)
          },
        }
      },
    },
  })
  return {
    invocations,
    [Symbol.dispose]: () => {
      if (previous) {
        Object.defineProperty(globalThis, 'caches', previous)
      } else {
        delete (globalThis as { caches?: CacheStorage }).caches
      }
    },
  }
}
