import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffItems from '../src/parts/DiffItems/DiffItems.ts'

test('isEqual should return true for identical states', () => {
  const leftItems: readonly StatusBarItem[] = []
  const rightItems: readonly StatusBarItem[] = []
  const state1: MainAreaState = {
    ...createDefaultState(),
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return true for states with same items', () => {
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const leftItems: readonly StatusBarItem[] = [item1]
  const rightItems: readonly StatusBarItem[] = [item2]
  const state1: MainAreaState = {
    ...createDefaultState(),
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should return false when left arrays differ', () => {
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const state1: MainAreaState = {
    ...createDefaultState(),
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when right arrays differ', () => {
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const state1: MainAreaState = {
    ...createDefaultState(),
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when both arrays differ', () => {
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const item2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test 2' }],
    name: 'test2',
    tooltip: 'Test tooltip 2',
  }
  const state1: MainAreaState = {
    ...createDefaultState(),
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when left array length differs', () => {
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const state1: MainAreaState = {
    ...createDefaultState(),
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return false when right array length differs', () => {
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const state1: MainAreaState = {
    ...createDefaultState(),
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(false)
})

test('isEqual should return true for empty states', () => {
  const state1: MainAreaState = createDefaultState()
  const state2: MainAreaState = state1
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})

test('isEqual should ignore uid when comparing', () => {
  const leftItems: readonly StatusBarItem[] = []
  const rightItems: readonly StatusBarItem[] = []
  const state1: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }
  const state2: MainAreaState = {
    ...createDefaultState(),
    uid: 2,
  }
  expect(DiffItems.isEqual(state1, state2)).toBe(true)
})
