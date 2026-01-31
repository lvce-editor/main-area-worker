import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getGroupIndex } from '../src/parts/GetGroupIndex/GetGroupIndex.ts'

test('getGroupIndex should return correct index when group exists', () => {
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
          size: 33,
          tabs: [],
          isEmpty: true,
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 33,
          tabs: [],
          isEmpty: true,
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          size: 34,
          tabs: [],
          isEmpty: true,
        },
      ],
    },
  }
  expect(getGroupIndex(state, 1)).toBe(0)
  expect(getGroupIndex(state, 2)).toBe(1)
  expect(getGroupIndex(state, 3)).toBe(2)
})

test('getGroupIndex should return -1 when group does not exist', () => {
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
          isEmpty: true,
        },
      ],
    },
  }
  expect(getGroupIndex(state, 999)).toBe(-1)
})
