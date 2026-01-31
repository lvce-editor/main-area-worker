import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleResize } from '../src/parts/HandleResize/HandleResize.ts'

test('handleResize should update x, y, width, and height', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const result = await handleResize(state, 10, 20, 800, 600)

  expect(result.x).toBe(10)
  expect(result.y).toBe(20)
  expect(result.width).toBe(800)
  expect(result.height).toBe(600)
  expect(result.uid).toBe(1)
})

test('handleResize should preserve other state properties', async () => {
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

  const result = await handleResize(state, 0, 0, 1024, 768)

  expect(result.assetDir).toBe('/assets')
  expect(result.platform).toBe(2)
  expect(result.tabHeight).toBe(40)
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.direction).toBe('horizontal')
})

test('handleResize should not mutate original state', async () => {
  const state: MainAreaState = { ...createDefaultState(), uid: 1 }
  const originalX = state.x
  const originalY = state.y
  const originalWidth = state.width
  const originalHeight = state.height

  await handleResize(state, 50, 100, 400, 300)

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

  const result = await handleResize(state, 0, 0, 0, 0)

  expect(result.x).toBe(0)
  expect(result.y).toBe(0)
  expect(result.width).toBe(0)
  expect(result.height).toBe(0)
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
          id: 1,,
    isEmpty: false
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
    'Viewlet.setBounds': async () => {},
  })

  await handleResize(state, 10, 20, 800, 600)

  expect(mockRpc.invocations).toEqual([
    ['Viewlet.setBounds', 100, { height: 560, width: 800, x: 10, y: 60 }],
    ['Viewlet.setBounds', 101, { height: 560, width: 800, x: 10, y: 60 }],
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
          id: 1,,
    isEmpty: false
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
    'Viewlet.setBounds': async () => {},
  })

  await handleResize(state, 10, 20, 800, 600)

  expect(mockRpc.invocations).toEqual([])
})
