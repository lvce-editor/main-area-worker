import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual should return true when states share the same layout reference', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = state1
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return false when states have different layout references with same content', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when layouts have different activeGroupId', () => {
  const state1: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      activeGroupId: '1',
    },
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      activeGroupId: '2',
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when layouts have different direction', () => {
  const state1: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      direction: 'horizontal',
    },
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      direction: 'vertical',
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when layouts have different groups', () => {
  const state1: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
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
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 50,
          tabs: [],
        },
      ],
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return true when comparing state to itself', () => {
  const state: MainAreaState = createDefaultState()
  expect(DiffItems.isEqual(state, state)).toBe(true)
})

test('isEqual should return false when one state has undefined activeGroupId and other has defined', () => {
  const state1: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      activeGroupId: undefined,
    },
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      activeGroupId: '1',
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when layouts have same structure but different references', () => {
  const { layout } = createDefaultState()
  const state1: MainAreaState = {
    ...createDefaultState(),
    layout,
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...layout,
    },
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})
