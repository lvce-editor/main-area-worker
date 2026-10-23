import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getActiveTabId } from '../src/parts/SelectTab/GetActiveTabId/GetActiveTabId.ts'

test('getActiveTabId should return active tab id from active group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: false,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: 3,
          direction: 1,
          id: 2,
          isEmpty: false,
          isFocused: true,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  expect(getActiveTabId(state)).toBe(3)
})

test('getActiveTabId should return undefined when active group is missing', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 999,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  expect(getActiveTabId(state)).toBeUndefined()
})
