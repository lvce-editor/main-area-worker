import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('diff should return empty array when states are equal', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = oldState
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test('diff should return RenderItems when left items differ', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when right items differ', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when both left and right items differ', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 2,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when left array length differs', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should return RenderItems when right array length differs', () => {
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test('diff should ignore uid when comparing', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }
  const newState: MainAreaState = {
    ...oldState,
    uid: 2,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})
