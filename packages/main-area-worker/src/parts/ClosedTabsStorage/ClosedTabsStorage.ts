import type { ClosedTabEntry } from '../MainAreaState/MainAreaState.ts'
import * as CacheStorageClient from '../CacheStorageClient/CacheStorageClient.ts'

const cacheName = 'lvce0main-area-tabs'
const cacheDuration = 90 * 24 * 60 * 60 * 1000
const maxClosedTabs = 20
const pendingOperations = new Map<number, { readonly id: object; readonly promise: Promise<unknown> }>()
const sessionId = encodeURIComponent(`session-${new Date().toISOString()}`)

const getKey = (uid: number): string => {
  return `https://lvce-editor.invalid/closed-tabs/${sessionId}/${uid}`
}

const run = async <T>(uid: number, operation: () => Promise<T>): Promise<T> => {
  const previous = pendingOperations.get(uid)?.promise || Promise.resolve()
  const id = {}
  const current = (async (): Promise<T> => {
    await previous
    try {
      return await operation()
    } finally {
      if (pendingOperations.get(uid)?.id === id) {
        pendingOperations.delete(uid)
      }
    }
  })()
  pendingOperations.set(uid, { id, promise: current })
  return await current
}

const isClosedTabEntry = (value: unknown): value is ClosedTabEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const entry = value as Partial<ClosedTabEntry>
  return Boolean(
    entry.group &&
    typeof entry.group === 'object' &&
    entry.tab &&
    typeof entry.tab === 'object' &&
    typeof entry.groupIndex === 'number' &&
    typeof entry.tabIndex === 'number',
  )
}

const getEntries = async (key: string): Promise<readonly ClosedTabEntry[]> => {
  const item = (await CacheStorageClient.invoke('Cache.getCacheStorageItem', key, cacheName)) as { readonly body: ArrayBuffer } | null
  const entries: unknown = item ? JSON.parse(new TextDecoder().decode(item.body)) : []
  return Array.isArray(entries) ? entries.filter(isClosedTabEntry) : []
}

const setEntries = async (key: string, entries: readonly ClosedTabEntry[]): Promise<void> => {
  const value = JSON.stringify(entries)
  const expires = new Date(Date.now() + cacheDuration).toUTCString()
  const result = (await CacheStorageClient.invoke('Cache.setCacheStorageItem', key, value, cacheName, {
    'Content-Length': String(value.length),
    'Content-Type': 'application/json',
    Expires: expires,
  })) as { readonly success: boolean }
  if (!result?.success) {
    throw new Error('Failed to store closed tab history')
  }
}

const removeEntries = async (key: string): Promise<boolean> => {
  return (await CacheStorageClient.invoke('Cache.removeCacheStorageItem', key, cacheName)) as boolean
}

const compact = (entry: ClosedTabEntry): ClosedTabEntry => {
  return {
    ...entry,
    group: {
      ...entry.group,
      tabs: [],
    },
  }
}

export const add = (uid: number, entries: readonly ClosedTabEntry[]): Promise<void> => {
  if (entries.length === 0) {
    return Promise.resolve()
  }
  return run(uid, async () => {
    try {
      const key = getKey(uid)
      const existing = await getEntries(key)
      const compactEntries = entries.map(compact)
      await setEntries(key, [...existing, ...compactEntries].slice(-maxClosedTabs))
    } catch {
      // Closed tab history is optional and must never break editor commands.
    }
  })
}

export const clear = (uid: number): Promise<void> => {
  return run(uid, async () => {
    try {
      await removeEntries(getKey(uid))
    } catch {
      // Closed tab history is optional and must never break workspace changes.
    }
  })
}

export const takeLast = (uid: number): Promise<ClosedTabEntry | undefined> => {
  return run(uid, async () => {
    try {
      const key = getKey(uid)
      const entries = await getEntries(key)
      const entry = entries.at(-1)
      if (!isClosedTabEntry(entry)) {
        await removeEntries(key)
        return undefined
      }
      if (entries.length === 1) {
        const removed = await removeEntries(key)
        if (!removed) {
          return undefined
        }
      } else {
        await setEntries(key, entries.slice(0, -1))
      }
      return entry
    } catch {
      return undefined
    }
  })
}
