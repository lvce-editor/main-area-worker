import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { save, saveAll, saveWithoutFormatting } from '../src/parts/Save/Save.ts'

afterEach(() => {
  const defaultState = createDefaultState()
  MainAreaStates.set(0, defaultState, defaultState)
})

const createSaveState = ({
  id = 1,
  isDirty = true,
  uid = 0,
  uri = 'file:///file.ts',
}: {
  readonly id?: number
  readonly isDirty?: boolean
  readonly uid?: number
  readonly uri?: string
} = {}): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: id,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [
          {
            editorUid: id,
            errorMessage: '',
            icon: '',
            id,
            isDirty,
            isPreview: false,
            language: 'typescript',
            loadingState: 'loaded',
            title: 'file.ts',
            uri,
          },
        ],
      },
    ],
  },
  uid,
})

test('save should return state when no active tab', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          id: 1,
          isEmpty: true,
          isFocused: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).toBe(state)
})

test('saveWithoutFormatting should safely return state when no active tab', async () => {
  const state = createDefaultState()

  const result = await saveWithoutFormatting(state)

  expect(result).toBe(state)
})

test('save should return state when tab is loading', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: 123,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              language: 'plaintext',
              loadingState: 'loading',
              title: 'File 1',
              uri: 'file:///file-1',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).toBe(state)
})

test('save should clear dirty state after a successful save', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: 123,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              language: 'typescript',
              loadingState: 'loaded',
              title: 'File 1',
              uri: 'file:///file-1',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.save', 123],
    ['Main.handleModifiedStatusChange', 'file:///file-1', false],
  ])
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('saveWithoutFormatting should bypass formatting and clear dirty state after a successful save', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })
  const state = createSaveState()

  const result = await saveWithoutFormatting(state)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.save', 1, true],
    ['Main.handleModifiedStatusChange', 'file:///file.ts', false],
  ])
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('save should notify layout after saving settings', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleSettingsChanged': async () => undefined,
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: 123,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              language: 'json',
              loadingState: 'loaded',
              title: 'settings.json',
              uri: 'app://settings.json',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.save', 123],
    ['Layout.handleSettingsChanged'],
    ['Main.handleModifiedStatusChange', 'app://settings.json', false],
  ])
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('save should use the latest stored state when the call-site state is stale', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })

  const staleState = createDefaultState()
  const storedState: MainAreaState = {
    ...staleState,
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: 7,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              language: 'typescript',
              loadingState: 'loaded',
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  MainAreaStates.set(staleState.uid, staleState, storedState)

  const result = await save(staleState)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.save', 7],
    ['Main.handleModifiedStatusChange', 'file:///test.ts', false],
  ])
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('save should work when the state is not registered', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })
  const state = createSaveState({ uid: 99 })

  const result = await save(state)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
  expect(mockRpc.invocations).toEqual([
    ['Viewlet.save', 1],
    ['Main.handleModifiedStatusChange', 'file:///file.ts', false],
  ])
})

test('save should use a stored state whose active tab has the same id', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })
  const state = createSaveState()
  const storedState = {
    ...createSaveState(),
    width: 500,
  }
  MainAreaStates.set(0, state, storedState)

  const result = await save(state)

  expect(result.width).toBe(500)
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('save should use a stored state whose active tab has the same uri', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })
  const state = createSaveState({ id: 1 })
  const storedState = {
    ...createSaveState({ id: 2 }),
    width: 500,
  }
  MainAreaStates.set(0, state, storedState)

  const result = await save(state)

  expect(result.width).toBe(500)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
})

test('save should keep the requested state when the stored active tab differs', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })
  const state = createSaveState({ id: 1, uri: 'file:///requested.ts' })
  const storedState = createSaveState({ id: 2, uri: 'file:///other.ts' })
  MainAreaStates.set(0, state, storedState)

  const result = await save(state)

  expect(mockRpc.invocations[0]).toEqual(['Viewlet.save', 1])
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
})

test('save should invoke the editor for an unmodified tab without changing state', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.save': async () => ({ modified: false }),
  })
  const state = createSaveState({ isDirty: false, uid: 99 })

  const result = await save(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Viewlet.save', 1]])
})

test('save should preserve dirty state when the editor remains modified', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.save': async () => ({ modified: true }),
  })
  const state = createSaveState({ uid: 99 })

  const result = await save(state)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(mockRpc.invocations).toEqual([['Viewlet.save', 1]])
})

test('save should clear dirty state without notifying for a tab without a uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.save': async () => ({ modified: false }),
  })
  const state = createSaveState({ uid: 99, uri: '' })

  const result = await save(state)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
  expect(mockRpc.invocations).toEqual([['Viewlet.save', 1]])
})

const createSaveAllContext = () => {
  let state = createSaveState()
  const group = state.layout.groups[0]
  state = {
    ...state,
    layout: { ...state.layout, groups: [{ ...group, tabs: [group.tabs[0], { ...group.tabs[0], editorUid: 2, id: 2, uri: 'file:///second.csv' }] }] },
  }
  return {
    getState: () => state,
    updateState: async (updater: (state: MainAreaState) => MainAreaState) => {
      state = updater(state)
      return state
    },
  }
}

test('saveAll saves dirty tabs without changing the selected tab', async () => {
  const context = createSaveAllContext()
  using mockRpc = RendererWorker.registerMockRpc({ 'Viewlet.save': async () => ({ modified: false }) })
  await saveAll(context)
  expect(context.getState().layout.groups[0].tabs.map((tab) => tab.isDirty)).toEqual([false, false])
  expect(context.getState().layout.groups[0].activeTabId).toBe(1)
  expect(mockRpc.invocations).toEqual([
    ['Viewlet.save', 1],
    ['Viewlet.save', 2],
  ])
})

test('saveAll preserves failed and still-modified documents', async () => {
  const context = createSaveAllContext()
  using _mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.save': async (uid: number) => {
      if (uid === 2) throw new Error('disk full')
      return { modified: true }
    },
  })
  await expect(saveAll(context)).rejects.toThrow('disk full')
  expect(context.getState().layout.groups[0].tabs.every((tab) => tab.isDirty)).toBe(true)
})

test('saveAll retains earlier successes when a later save fails', async () => {
  const context = createSaveAllContext()
  using _mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.save': async (uid: number) => {
      if (uid === 2) throw new Error('disk full')
      return { modified: false }
    },
  })
  await expect(saveAll(context)).rejects.toThrow('disk full')
  expect(context.getState().layout.groups[0].tabs.map((tab) => tab.isDirty)).toEqual([false, true])
})

test.each([save, saveWithoutFormatting])('saving the focused second group preserves the dirty first group', async (saveCommand) => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.save': async () => ({ modified: false }),
  })
  const base = createSaveState({ uid: 99 })
  const first = base.layout.groups[0]
  const second = {
    ...first,
    activeTabId: 2,
    id: 2,
    tabs: [{ ...first.tabs[0], editorUid: 42, id: 2, uri: 'file:///second.ts' }],
  }
  const state = { ...base, layout: { ...base.layout, activeGroupId: 2, groups: [{ ...first, isFocused: false }, second] } }
  const result = await saveCommand(state)
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(result.layout.groups[1].tabs[0].isDirty).toBe(false)
  expect(mockRpc.invocations[0]).toEqual(saveCommand === save ? ['Viewlet.save', 42] : ['Viewlet.save', 42, true])
})
