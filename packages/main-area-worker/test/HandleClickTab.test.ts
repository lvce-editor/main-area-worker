import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickTab } from '../src/parts/HandleClickTab/HandleClickTab.ts'

test('handleClickTab should return state unchanged when groupIndexRaw is empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '', '0')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should return state unchanged when indexRaw is empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '0', '')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should return state unchanged when both groupIndexRaw and indexRaw are empty', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '', '')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should select tab when valid groupIndex and index are provided', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '0', '2')

  expect(result.layout.groups[0].activeTabId).toBe(3)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should select tab from second group', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
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
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '1', '1')

  expect(result.layout.groups[1].activeTabId).toBe(3)
  expect(result.layout.activeGroupId).toBe(2)
  expect(result).not.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should return state unchanged when groupIndex is out of bounds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '5', '0')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should return state unchanged when tab index is out of bounds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '0', '10')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should return state unchanged when groupIndex is negative', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '-1', '0')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should return state unchanged when tab index is negative', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '0', '-1')

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleClickTab should parse string indexes correctly', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = await handleClickTab(state, '0', '1')

  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(mockRpc.invocations).toEqual([])
})
