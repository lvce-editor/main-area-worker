import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceChange } from '../src/parts/HandleWorkspaceChange/HandleWorkspaceChange.ts'

test('handleWorkspaceChange should clear activeGroupId and groups', () => {
  const initialState: MainAreaState = {
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

  const result = handleWorkspaceChange(initialState)

  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result.layout.groups).toEqual([])
  expect(result.layout.direction).toBe('horizontal')
})

test('handleWorkspaceChange should preserve other state properties', () => {
  const initialState: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/assets',
    height: 800,
    layout: {
      activeGroupId: 2,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 2,,
    isEmpty: true
          size: 50,
          tabs: [],
        },
      ],
    },
    tabHeight: 40,
    width: 1200,
  }

  const result = handleWorkspaceChange(initialState)

  expect(result.assetDir).toBe('/assets')
  expect(result.height).toBe(800)
  expect(result.width).toBe(1200)
  expect(result.tabHeight).toBe(40)
})

test('handleWorkspaceChange should handle empty groups', () => {
  const initialState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = handleWorkspaceChange(initialState)

  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result.layout.groups).toEqual([])
})
