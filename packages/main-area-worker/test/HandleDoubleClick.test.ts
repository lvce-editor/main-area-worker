import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDoubleClick } from '../src/parts/HandleDoubleClick/HandleDoubleClick.ts'

test('handleDoubleClick should return state unchanged when no groups exist', async () => {

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = await handleDoubleClick(state)

  expect(result).toBe(state)
})

test('handleDoubleClick should return state unchanged when single group with single tab exists', async () => {
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

  const result = await handleDoubleClick(state)

  expect(result).toBe(state)
})

test('handleDoubleClick should preserve state properties', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/assets',
    fileIconCache: {},
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
    platform: 2,
    tabHeight: 40,
    uid: 123,
  }

  const result = await handleDoubleClick(state)

  expect(result.assetDir).toBe('/assets')
  expect(result.platform).toBe(2)
  expect(result.tabHeight).toBe(40)
  expect(result.uid).toBe(123)
  expect(result.layout.activeGroupId).toBe(1)
})

test('handleDoubleClick should not mutate original state', async () => {
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
    uid: 1,
  }

  const originalState = JSON.stringify(state)
  await handleDoubleClick(state)

  expect(JSON.stringify(state)).toBe(originalState)
})

test('handleDoubleClick should handle multiple groups', async () => {
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
          ],
        },
      ],
    },
  }

  const result = await handleDoubleClick(state)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[1].id).toBe(2)
})

test('handleDoubleClick should return a valid MainAreaState', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
  }

  const result = await handleDoubleClick(state)

  expect(result).toHaveProperty('assetDir')
  expect(result).toHaveProperty('layout')
  expect(result).toHaveProperty('platform')
  expect(result).toHaveProperty('tabHeight')
  expect(result).toHaveProperty('uid')
})
