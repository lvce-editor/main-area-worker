import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { Tab } from '../src/parts/Tab/Tab.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { splitRight } from '../src/parts/SplitRight/SplitRight.ts'

test('splitRight should return state unchanged when group does not exist', () => {
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

  const result = splitRight(state, 999)

  expect(result.layout).toEqual(state.layout)
})

test('splitRight should split single group into two horizontal groups', () => {
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

  const result = splitRight(state, 1)

  expect(result.layout.direction).toBe('horizontal')
  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result.layout.groups[1].focused).toBe(true)
  expect(result.layout.groups[1].tabs.length).toBe(0)
})

test('splitRight should set new group as active', () => {
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

  const result = splitRight(state, 1)

  const newGroupId = result.layout.groups[1].id
  expect(result.layout.activeGroupId).toBe(newGroupId)
})

test('splitRight should place new group to the right', () => {
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

  const result = splitRight(state, 1)

  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[1].id).not.toBe(1)
  expect(result.layout.groups[1].id).toBeGreaterThan(0)
})

test('splitRight should split with multiple existing groups', () => {
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
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const result = splitRight(state, 1)

  expect(result.layout.groups.length).toBe(3)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].id).toBe(2)
  expect(result.layout.groups[2].focused).toBe(true)
})

test('splitRight should split middle group correctly', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          isEmpty: true,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: true,
          id: 2,
          isEmpty: true,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          isEmpty: true,
          size: 34,
          tabs: [],
        },
      ],
    },
  }

  const result = splitRight(state, 2)

  expect(result.layout.groups.length).toBe(4)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[1].id).toBe(2)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[2].id).toBe(3)
  expect(result.layout.groups[3].focused).toBe(true)
})

test('splitRight should create new group with empty tabs', () => {
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
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'test.txt',
              uri: '/path/to/test.txt',
            },
          ],
        },
      ],
    },
  }

  const result = splitRight(state, 1)

  expect(result.layout.groups[1].tabs.length).toBe(0)
  expect(result.layout.groups[0].tabs.length).toBe(1)
})

test('splitRight should preserve original group tabs', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'test.txt',
    uri: '/path/to/test.txt',
  }

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
          tabs: [tab],
        },
      ],
    },
  }

  const result = splitRight(state, 1)

  expect(result.layout.groups[0].tabs).toEqual([tab])
  expect(result.layout.groups[1].tabs).toEqual([])
})

test('splitRight should maintain activeTabId in original group', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 1,
    icon: '',
    id: 5,
    isDirty: false,
    title: 'test.txt',
    uri: '/path/to/test.txt',
  }

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 5,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [tab],
        },
      ],
    },
  }

  const result = splitRight(state, 1)

  expect(result.layout.groups[0].activeTabId).toBe(5)
  expect(result.layout.groups[1].activeTabId).toBeUndefined()
})
