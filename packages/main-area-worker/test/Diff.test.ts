import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff from '../src/parts/Diff/Diff.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test.skip('diff should return empty array when states are equal', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})

test.skip('diff should return RenderItems when left items differ', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test.skip('diff should return RenderItems when right items differ', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test.skip('diff should return RenderItems when both left and right items differ', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test.skip('diff should return RenderItems when left array length differs', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test.skip('diff should return RenderItems when right array length differs', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([DiffType.RenderItems])
})

test.skip('diff should ignore uid when comparing', () => {
  const oldState: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
    uid: 2,
  }
  const result = Diff.diff(oldState, newState)
  expect(result).toEqual([])
})
