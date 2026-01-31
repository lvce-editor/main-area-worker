import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { save } from '../src/parts/Save/Save.ts'

test('save should return state when no active tab', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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

test('save should return state when tab is not loaded', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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

test('save should call RendererWorker with Editor.save when tab is loaded', async () => {
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

test('save should call RendererWorker with Editor.save when tab is idle', async () => {
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
          id: 1,
          isEmpty: false,
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

test('save should return state when no focused group', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: false,
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
test('save should set isDirty to false when tab is loaded and dirty', async () => {
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
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 123,
              icon: '',
              id: 1,
              isDirty: true,
              loadingState: 'loaded',
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  expect(result).not.toBe(state)
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
  expect(mockRpc.invocations[0]).toEqual(['Editor.save', 123])
})

test('save should preserve other tab properties when saving', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
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
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 789,
              icon: '📄',
              id: 1,
              isDirty: true,
              loadingState: 'idle',
              title: 'MyFile.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  const savedTab = result.layout.groups[0].tabs[0]
  expect(savedTab.editorUid).toBe(789)
  expect(savedTab.icon).toBe('📄')
  expect(savedTab.id).toBe(1)
  expect(savedTab.editorType).toBe('text')
  expect(savedTab.title).toBe('MyFile.ts')
  expect(savedTab.loadingState).toBe('idle')
  expect(savedTab.isDirty).toBe(false)
})

test('save should handle multiple groups correctly', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
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
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: 111,
              icon: '',
              id: 1,
              isDirty: true,
              loadingState: 'loaded',
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: 222,
              icon: '',
              id: 2,
              isDirty: true,
              loadingState: 'loaded',
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = await save(state)

  // Should only save the active tab in the focused group
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
  expect(result.layout.groups[1].tabs[0].isDirty).toBe(true)
  expect(_mockRpc.invocations[0]).toEqual(['Editor.save', 111])
})