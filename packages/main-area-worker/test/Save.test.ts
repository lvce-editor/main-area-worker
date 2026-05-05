import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { save } from '../src/parts/Save/Save.ts'

afterEach(() => {
  const defaultState = createDefaultState()
  MainAreaStates.set(0, defaultState, defaultState)
})

test('save should return state when no active tab', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = await save(state)

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
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
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
    'Editor.save': async () => ({ modified: false }),
    'Main.handleModifiedStatusChange': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
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
    ['Editor.save', 123],
    ['Main.handleModifiedStatusChange', 'file:///file-1', false],
  ])
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('save should use the latest stored state when the call-site state is stale', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.save': async () => ({ modified: false }),
    'Main.handleModifiedStatusChange': async () => undefined,
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
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
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
    ['Editor.save', 7],
    ['Main.handleModifiedStatusChange', 'file:///test.ts', false],
  ])
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})
