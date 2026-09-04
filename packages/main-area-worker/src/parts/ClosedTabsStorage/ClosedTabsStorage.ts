import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ClosedTabEntry } from '../MainAreaState/MainAreaState.ts'

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
  const entries = await RendererWorker.invoke('CacheStorage.getJson', key)
  return Array.isArray(entries) ? entries.filter(isClosedTabEntry) : []
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
      await RendererWorker.invoke('CacheStorage.setJson', key, [...existing, ...compactEntries].slice(-maxClosedTabs))
    } catch {
      // Closed tab history is optional and must never break editor commands.
    }
  })
}

export const clear = (uid: number): Promise<void> => {
  return run(uid, async () => {
    try {
      await RendererWorker.invoke('CacheStorage.setJson', getKey(uid), [])
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
        return undefined
      }
      await RendererWorker.invoke('CacheStorage.setJson', key, entries.slice(0, -1))
      return entry
    } catch {
      return undefined
    }
  })
}
