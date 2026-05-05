import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { closeTabAndSave } from '../src/parts/CloseTabAndSave/CloseTabAndSave.ts'

afterEach(() => {
  const defaultState = createDefaultState()
  MainAreaStates.set(0, defaultState, defaultState)
})

test('closeTabAndSave should save a dirty tab before closing it', async () => {
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
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    ['Editor.save', 123],
    ['Main.handleModifiedStatusChange', 'file:///test.ts', false],
  ])
  expect(result.layout.groups).toHaveLength(0)
})

test('closeTabAndSave should save an editor-backed tab before closing it', async () => {
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
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    ['Editor.save', 123],
    ['Main.handleModifiedStatusChange', 'file:///test.ts', false],
  ])
  expect(result.layout.groups).toHaveLength(0)
})

test('closeTabAndSave should skip saving tabs without editor instances', async () => {
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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([])
  expect(result.layout.groups).toHaveLength(0)
})