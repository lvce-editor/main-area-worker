import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ClosedTabEntry, MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { restoreClosedTab } from '../src/parts/RestoreClosedTab/RestoreClosedTab.ts'
import { mockCacheStorage } from '../test-support/MockCacheStorage.ts'

const tab: Tab = {
  editorUid: 1,
  icon: '',
  id: 1,
  isDirty: false,
  isPreview: false,
  loadingState: 'loaded',
  title: 'file.ts',
  uri: '/file.ts',
}

const group = {
  activeTabId: 1,
  direction: 1 as const,
  focused: true,
  id: 1,
  isEmpty: false,
  size: 100,
  tabs: [tab],
}

const entry: ClosedTabEntry = {
  group,
  groupIndex: 0,
  tab,
  tabIndex: 0,
}

test('restoreClosedTab returns unchanged state when cache storage is empty', async () => {
  using mockRpc = mockCacheStorage({
    getJson: () => [],
  })
  const state = createDefaultState()

  await expect(restoreClosedTab(state)).resolves.toBe(state)
  expect(mockRpc.invocations).toEqual([['getJson', expect.stringContaining('/closed-tabs/')]])
})

test('restoreClosedTab focuses an already open tab returned from cache storage', async () => {
  using mockRpc = mockCacheStorage({
    getJson: () => [entry],
    setJson: () => undefined,
  })
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [group],
    },
  }

  const result = await restoreClosedTab(state)

  expect(mockRpc.invocations.map(([command]) => command)).toEqual(['getJson', 'setJson'])
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('restoreClosedTab recreates an active process explorer viewlet', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })
  const processExplorerTab: Tab = {
    editorInput: {
      type: 'process-explorer',
    },
    editorUid: 1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    loadingState: 'loaded',
    title: 'Process Explorer',
    uri: 'process-explorer://',
  }
  const processExplorerGroup = {
    ...group,
    tabs: [processExplorerTab],
  }
  const entry: ClosedTabEntry = {
    group: processExplorerGroup,
    groupIndex: 0,
    tab: processExplorerTab,
    tabIndex: 0,
  }
  using _mockCacheStorage = mockCacheStorage({
    getJson: () => [entry],
    setJson: () => undefined,
  })
  const state = createDefaultState()

  const result = await restoreClosedTab(state)

  const restoredTab = result.layout.groups[0].tabs[0]
  expect(restoredTab.editorUid).not.toBe(-1)
  expect(mockRpc.invocations).toEqual([
    ['Layout.createViewlet', 'ProcessExplorer', restoredTab.editorUid, 1, { height: -35, width: 0, x: 0, y: 35 }, 'process-explorer://'],
    ['Viewlet.getTitle', restoredTab.editorUid],
  ])
})

test('restoreClosedTab preserves the rendered state for the next diff', async () => {
  const closedTab = {
    ...tab,
    editorUid: -1,
    uri: '',
  }
  const closedGroup = {
    ...group,
    tabs: [closedTab],
  }
  const closedEntry: ClosedTabEntry = {
    group: closedGroup,
    groupIndex: 0,
    tab: closedTab,
    tabIndex: 0,
  }
  using _mockRpc = mockCacheStorage({
    getJson: () => [closedEntry],
    setJson: () => undefined,
  })
  const state = createDefaultState()
  MainAreaStates.set(state.uid, state, state)

  const result = await restoreClosedTab(state)

  expect(MainAreaStates.get(state.uid).oldState).toBe(state)
  expect(MainAreaStates.get(state.uid).newState).toBe(result)
})

test('restoreClosedTab ignores cache storage errors', async () => {
  using _mockRpc = mockCacheStorage({
    getJson: () => {
      throw new Error('cache unavailable')
    },
  })
  const state = createDefaultState()

  await expect(restoreClosedTab(state)).resolves.toBe(state)
})
