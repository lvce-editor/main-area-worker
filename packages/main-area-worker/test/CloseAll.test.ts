import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeAll } from '../src/parts/CloseAll/CloseAll.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeAll should close all tabs and groups', () => {
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
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
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

  const result = closeAll(state)

  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result).not.toBe(state)
})

test('closeAll should preserve layout direction', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
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

  const result = closeAll(state)

  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('closeAll should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test/assets',
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
    platform: 1,
    uid: 123,
  }

  const result = closeAll(state)

  expect(result.assetDir).toBe('/test/assets')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(123)
})

test('closeAll should handle empty state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = closeAll(state)

  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('closeAll should handle multiple groups with many tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 2,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 33,
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
              isDirty: true,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 33,
          tabs: [
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
        {
          activeTabId: 4,
          focused: false,
          id: 3,
          isEmpty: false,
          size: 34,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: true,
              title: 'File 4',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = closeAll(state)

  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBeUndefined()
})
