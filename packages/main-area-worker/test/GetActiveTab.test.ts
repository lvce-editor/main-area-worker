import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getActiveTab } from '../src/parts/GetActiveTab/GetActiveTab.ts'

test('getActiveTab should return active tab when group is focused and has activeTabId', () => {
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
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text',
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
          size: 50,
          tabs: [
            {
              content: 'content3',
              editorType: 'text',
              id: 3,
              isDirty: false,
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

test('getActiveTab should return undefined when no group is focused', () => {
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
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: false,
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

test('getActiveTab should return undefined when focused group has no activeTabId', () => {
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
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 999,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: false,
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
