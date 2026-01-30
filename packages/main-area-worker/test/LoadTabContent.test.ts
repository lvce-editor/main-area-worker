import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetNextRequestId from '../src/parts/GetNextRequestId/GetNextRequestId.ts'
import * as LoadTabContent from '../src/parts/LoadTabContent/LoadTabContent.ts'

const createStateWithTab = (tabOverrides: Partial<Tab> = {}): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        size: 100,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: '',
            id: 1,
            isDirty: false,
            title: 'file.txt',
            uri: '/test/file.txt',
            ...tabOverrides,
          },
        ],
      },
    ],
  },
  uid: 1,
})

test('getNextRequestId returns incrementing IDs', () => {
  GetNextRequestId.resetRequestIdCounter()
  const id1 = GetNextRequestId.getNextRequestId()
  const id2 = GetNextRequestId.getNextRequestId()
  const id3 = GetNextRequestId.getNextRequestId()

  expect(id2).toBe(id1 + 1)
  expect(id3).toBe(id2 + 1)
})

test('resetRequestIdCounter resets the counter', () => {
  GetNextRequestId.getNextRequestId()
  GetNextRequestId.getNextRequestId()
  GetNextRequestId.resetRequestIdCounter()
  const id = GetNextRequestId.getNextRequestId()

  expect(id).toBe(1)
})

test('findTab returns tab when found', () => {
  const state = createStateWithTab()
  const result = LoadTabContent.findTab(state, 1)

  expect(result).toBeDefined()
  expect(result?.id).toBe(1)
  expect(result?.uri).toBe('/test/file.txt')
})

test('findTab returns undefined when tab not found', () => {
  const state = createStateWithTab()
  const result = LoadTabContent.findTab(state, 999)

  expect(result).toBeUndefined()
})

test('updateTab updates tab properties', () => {
  const state = createStateWithTab()
  const result = LoadTabContent.updateTab(state, 1, {
    loadingState: 'loaded',
  })

  const updatedTab = LoadTabContent.findTab(result, 1)
  expect(updatedTab?.loadingState).toBe('loaded')
})

test('updateTab returns unchanged state when tab not found', () => {
  const state = createStateWithTab()
  const result = LoadTabContent.updateTab(state, 999, {})

  expect(result).toEqual(state)
})

test('loadTabContentAsync loads content successfully', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => 'file content here',
  })

  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

  const state: MainAreaState = {
    ...createStateWithTab({
      loadingState: 'loading',
    }),
  }

  const getLatestState = (): MainAreaState => state

  const result = await LoadTabContent.loadTabContentAsync(1, '/test/file.txt', requestId, getLatestState)

  const tab = LoadTabContent.findTab(result, 1)
  expect(tab?.loadingState).toBe('loaded')
  expect(tab?.errorMessage).toBeUndefined()
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0]).toEqual(['FileSystem.readFile', '/test/file.txt'])
})

test('loadTabContentAsync handles error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => {
      throw new Error('File not found')
    },
  })

  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

  const state: MainAreaState = {
    ...createStateWithTab({
      loadingState: 'loading',
    }),
  }

  const getLatestState = (): MainAreaState => state

  const result = await LoadTabContent.loadTabContentAsync(1, '/test/file.txt', requestId, getLatestState)

  const tab = LoadTabContent.findTab(result, 1)
  expect(tab?.loadingState).toBe('error')
  expect(tab?.errorMessage).toBe('File not found')
  expect(mockRpc.invocations.length).toBe(1)
})

test.skip('loadTabContentAsync discards result when request ID changed (race condition)', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => 'old content',
  })

  GetNextRequestId.resetRequestIdCounter()
  const oldRequestId = GetNextRequestId.getNextRequestId()
  const newRequestId = GetNextRequestId.getNextRequestId()

  // Simulate a newer request being started while the old one is in flight
  const newerState: MainAreaState = {
    ...createStateWithTab({
      loadingState: 'loading',
    }),
  }

  const getLatestState = (): MainAreaState => newerState

  const result = await LoadTabContent.loadTabContentAsync(1, '/test/file.txt', oldRequestId, getLatestState)

  // The result should be the newer state unchanged because the request IDs don't match
  const tab = LoadTabContent.findTab(result, 1)
  expect(tab?.loadingState).toBe('loading')
})

test.skip('loadTabContentAsync discards result when tab no longer exists', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => 'content',
  })

  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

  // State where the tab has been closed (group is removed)
  const stateWithoutTab: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
    uid: 1,
  }

  const getLatestState = (): MainAreaState => stateWithoutTab

  const result = await LoadTabContent.loadTabContentAsync(1, '/test/file.txt', requestId, getLatestState)

  // Should return the state without any groups
  expect(result.layout.groups.length).toBe(0)
})

test('loadTabContentAsync handles non-Error exception', async () => {
  RendererWorker.registerMockRpc({
    'FileSystem.readFile': async () => {
      throw 'string error'
    },
  })

  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

  const state: MainAreaState = {
    ...createStateWithTab({
      loadingState: 'loading',
    }),
  }

  const getLatestState = (): MainAreaState => state

  const result = await LoadTabContent.loadTabContentAsync(1, '/test/file.txt', requestId, getLatestState)

  const tab = LoadTabContent.findTab(result, 1)
  expect(tab?.loadingState).toBe('error')
  expect(tab?.errorMessage).toBe('Failed to load file content')
})

test('updateTab updates tab in correct group when multiple groups exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'tab1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: true,
          id: 2,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'tab2',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = LoadTabContent.updateTab(state, 2, {
    loadingState: 'loaded',
  })

  // Check that the second group's tab was updated
  expect(LoadTabContent.findTab(result, 2)?.loadingState).toBe('loaded')
})
