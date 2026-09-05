import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ClosedTabEntry, EditorGroup, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as ClosedTabsStorage from '../src/parts/ClosedTabsStorage/ClosedTabsStorage.ts'

const closedTabsKeyRegex = /^https:\/\/lvce-editor\.invalid\/closed-tabs\/session-.+\/7$/

const createEntry = (id: number): ClosedTabEntry => {
  const tab: Tab = {
    editorUid: id,
    icon: '',
    id,
    isDirty: false,
    isPreview: false,
    title: `file-${id}.ts`,
    uri: `/file-${id}.ts`,
  }
  const group: EditorGroup = {
    activeTabId: id,
    direction: 1,
    focused: true,
    id: 1,
    isEmpty: false,
    size: 100,
    tabs: [tab],
  }
  return { group, groupIndex: 0, tab, tabIndex: 0 }
}

test('add does nothing for an empty entry list', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  await expect(ClosedTabsStorage.add(1, [])).resolves.toBeUndefined()

  expect(mockRpc.invocations).toEqual([])
})

test('add appends compact entries and retains the twenty most recent tabs', async () => {
  const existing = Array.from({ length: 20 }, (_, index) => createEntry(index))
  using mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => existing,
    'CacheStorage.setJson': () => undefined,
  })

  await ClosedTabsStorage.add(7, [createEntry(20), createEntry(21)])

  const [, key] = mockRpc.invocations[0]
  const stored = mockRpc.invocations[1][2] as readonly ClosedTabEntry[]
  expect(key).toMatch(closedTabsKeyRegex)
  expect(stored.map((entry) => entry.tab.id)).toEqual(Array.from({ length: 20 }, (_, index) => index + 2))
  expect(stored.at(-1)?.group.tabs).toEqual([])
})

test('takeLast reads and consumes the most recently cached entry', async () => {
  const first = createEntry(1)
  const last = createEntry(2)
  using mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => [first, last],
    'CacheStorage.setJson': () => undefined,
  })

  await expect(ClosedTabsStorage.takeLast(3)).resolves.toBe(last)

  const key = mockRpc.invocations[0][1]
  expect(mockRpc.invocations).toEqual([
    ['CacheStorage.getJson', key],
    ['CacheStorage.setJson', key, [first]],
  ])
})

test('operations for the same main area are serialized', async () => {
  let storedEntries: readonly ClosedTabEntry[] = []
  using _mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => storedEntries,
    'CacheStorage.setJson': (_key: string, value: unknown) => {
      storedEntries = value as readonly ClosedTabEntry[]
    },
  })

  await Promise.all([ClosedTabsStorage.add(1, [createEntry(1)]), ClosedTabsStorage.add(1, [createEntry(2)])])

  expect(storedEntries.map((entry) => entry.tab.id)).toEqual([1, 2])
})

test('invalid cached data is treated as an empty history', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => ({ invalid: true }),
  })

  await expect(ClosedTabsStorage.takeLast(1)).resolves.toBeUndefined()

  expect(mockRpc.invocations).toHaveLength(1)
})

test('invalid entries do not prevent restoring a valid cached tab', async () => {
  const entry = createEntry(1)
  using mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => [entry, { invalid: true }],
    'CacheStorage.setJson': () => undefined,
  })

  await expect(ClosedTabsStorage.takeLast(1)).resolves.toBe(entry)

  expect(mockRpc.invocations[1][2]).toEqual([])
})

test('cache read errors are ignored', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => {
      throw new Error('cache unavailable')
    },
  })

  await expect(ClosedTabsStorage.add(1, [createEntry(1)])).resolves.toBeUndefined()
  await expect(ClosedTabsStorage.takeLast(1)).resolves.toBeUndefined()
})

test('cache quota errors are ignored', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => [createEntry(1)],
    'CacheStorage.setJson': () => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    },
  })

  await expect(ClosedTabsStorage.add(1, [createEntry(2)])).resolves.toBeUndefined()
  await expect(ClosedTabsStorage.clear(1)).resolves.toBeUndefined()
  await expect(ClosedTabsStorage.takeLast(1)).resolves.toBeUndefined()
})
