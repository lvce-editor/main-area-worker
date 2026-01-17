import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { StatusBarItem } from '../src/parts/StatusBarItem/StatusBarItem.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff should return empty array when states are equal', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test('diff should return RenderItems when left items differ', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when right items differ', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when both left and right items differ', () => {
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
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
    statusBarItemsLeft: [item2],
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when left array length differs', () => {
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Test' }],
    name: 'test',
    tooltip: 'Test tooltip',
  }
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when right array length differs', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should ignore uid when comparing', () => {
  const leftItems: readonly StatusBarItem[] = []
  const rightItems: readonly StatusBarItem[] = []
  const oldState: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
    statusBarItemsRight: rightItems,
    uid: 2,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})
