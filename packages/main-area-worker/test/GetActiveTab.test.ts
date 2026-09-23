import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getActiveTab } from '../src/parts/GetActiveTab/GetActiveTab.ts'

test('getActiveTab should return active tab when group is isFocused and has activeTabId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 50,
          tabs: [
            {
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File 1',
            },
            {
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          direction: 1,
          id: 2,
          isEmpty: false,
          isFocused: false,
          size: 50,
          tabs: [
            {
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              isPreview: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }
  const result = getActiveTab(state)
  expect(result).toBeDefined()
  expect(result?.tab.id).toBe(1)
  expect(result?.groupId).toBe(1)
})

test('getActiveTab should return undefined when no group is isFocused', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: false,
          size: 100,
          tabs: [
            {
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = getActiveTab(state)
  expect(result).toBeUndefined()
})

test('getActiveTab should return undefined when isFocused group has no activeTabId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          id: 1,
          isEmpty: true,
          isFocused: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = getActiveTab(state)
  expect(result).toBeUndefined()
})

test('getActiveTab should return undefined when activeTabId does not match any tab', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 999,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = getActiveTab(state)
  expect(result).toBeUndefined()
})
