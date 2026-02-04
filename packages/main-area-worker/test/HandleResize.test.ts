import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleResize } from '../src/parts/HandleResize/HandleResize.ts'

test('handleResize should return resize commands', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const result = await handleResize(state, { height: 600, width: 800, x: 10, y: 20 })

  expect(Array.isArray(result)).toBe(true)
  expect(result).toEqual([])
})

test('handleResize should return resize commands array', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/assets',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 2,
    tabHeight: 40,
    uid: 123,
  }

  const result = await handleResize(state, { height: 768, width: 1024, x: 0, y: 0 })

  expect(Array.isArray(result)).toBe(true)
  expect(result).toEqual([])
})

test('handleResize should not mutate original state', async () => {
  const state: MainAreaState = { ...createDefaultState(), uid: 1 }
  const originalX = state.x
  const originalY = state.y
  const originalWidth = state.width
  const originalHeight = state.height

  await handleResize(state, { height: 300, width: 400, x: 50, y: 100 })

  expect(state.x).toBe(originalX)
  expect(state.y).toBe(originalY)
  expect(state.width).toBe(originalWidth)
  expect(state.height).toBe(originalHeight)
})

test('handleResize should handle zero values', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const result = await handleResize(state, { height: 0, width: 0, x: 0, y: 0 })

  expect(Array.isArray(result)).toBe(true)
  expect(result).toEqual([])
})

test('handleResize should resize all editors', async () => {
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
          size: 1,
          tabs: [
            {
              editorType: 'text',
              editorUid: 100,
              icon: 'file',
              id: 1,
              isDirty: false,
              title: 'test.ts',
            },
            {
              editorType: 'text',
              editorUid: 101,
              icon: 'file',
              id: 2,
              isDirty: false,
              title: 'other.ts',
            },
          ],
        },
      ],
    },
    tabHeight: 40,
    uid: 1,
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.resize': async () => [],
  })

  await handleResize(state, { height: 600, width: 800, x: 10, y: 20 })

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.resize', 100, { height: 560, width: 800, x: 10, y: 60 }],
    ['Viewlet.resize', 101, { height: 560, width: 800, x: 10, y: 60 }],
  ])
})

test('handleResize should skip editors with editorUid -1', async () => {
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
          size: 1,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: 'file',
              id: 1,
              isDirty: false,
              title: 'test.ts',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.resize': async () => [],
  })

  await handleResize(state, { height: 600, width: 800, x: 10, y: 20 })

  expect(mockRpc.invocations).toEqual([])
})
