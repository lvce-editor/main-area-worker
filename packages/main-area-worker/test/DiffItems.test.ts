import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual should return true for identical states', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = state1
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return true for states with same items', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = state1
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return false when left arrays differ', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [],
          isEmpty: true,
        },
      ],
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when right arrays differ', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [],
          isEmpty: true,
        },
      ],
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when both arrays differ', () => {
  const state1: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [],
          isEmpty: true,
        },
      ],
    },
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 100,
          tabs: [],
          isEmpty: true,
        },
      ],
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when left array length differs', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [],
          isEmpty: true,
        },
      ],
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when right array length differs', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [],
          isEmpty: true,
        },
      ],
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return true for empty states', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = state1
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should ignore uid when comparing', () => {
  const state1: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }
  const state2: MainAreaState = {
    ...state1,
    uid: 2,
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})
