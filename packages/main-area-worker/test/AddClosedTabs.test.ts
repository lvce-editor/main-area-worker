import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ClosedTabEntry, EditorGroup, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../src/parts/AddClosedTabs/AddClosedTabs.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

const closedTabsKeyRegex = /^https:\/\/lvce-editor\.invalid\/closed-tabs\/session-.+\/7$/

test('addClosedTabs stores compact entries outside of main area component state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'CacheStorage.getJson': () => [],
    'CacheStorage.setJson': () => undefined,
  })
  const state = { ...createDefaultState(), uid: 7 }
  const tab: Tab = {
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'file.ts',
    uri: '/file.ts',
  }
  const group: EditorGroup = {
    activeTabId: 1,
    direction: 1 as const,
    focused: true,
    id: 1,
    isEmpty: false,
    size: 100,
    tabs: [tab],
  }
  const entries: readonly ClosedTabEntry[] = [{ group, groupIndex: 0, tab, tabIndex: 0 }]

  const result = addClosedTabs(state, entries)
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(result).toBe(state)
  expect(result).not.toHaveProperty('closedTabs')
  const key = mockRpc.invocations[0][1]
  expect(key).toMatch(closedTabsKeyRegex)
  expect(mockRpc.invocations).toEqual([
    ['CacheStorage.getJson', key],
    [
      'CacheStorage.setJson',
      key,
      [
        {
          ...entries[0],
          group: {
            ...group,
            tabs: [],
          },
        },
      ],
    ],
  ])
})
