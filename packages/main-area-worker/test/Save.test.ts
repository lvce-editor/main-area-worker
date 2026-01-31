import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { save } from '../src/parts/Save/Save.ts'

test.skip('save should return state when no active tab', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).toBe(state)
})

test.skip('save should return state when tab is not loaded', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: ,
    isEmpty: false,,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 123,
              icon: '',
              id: 1,
              isDirty: false,
              loadingState: 'loading',
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).toBe(state)
})

test.skip('save should call RendererWorker with Editor.save when tab is loaded', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.save': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: ,
    isEmpty: false,,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 123,
              icon: '',
              id: 1,
              isDirty: false,
              loadingState: 'loaded',
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0]).toEqual(['Editor.save', 123])
})

test.skip('save should call RendererWorker with Editor.save when tab is idle', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.save': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: ,
    isEmpty: false,,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 456,
              icon: '',
              id: 1,
              isDirty: false,
              loadingState: 'idle',
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations.length).toBe(1)
  expect(mockRpc.invocations[0]).toEqual(['Editor.save', 456])
})

test.skip('save should return state when no focused group', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: ,
    isEmpty: false,,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 123,
              icon: '',
              id: 1,
              isDirty: false,
              loadingState: 'loaded',
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).toBe(state)
})
