import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffActiveTabVisibility/DiffActiveTabVisibility.ts'

test('isEqual returns true when layout and width are unchanged', () => {
  const state = createDefaultState()

  expect(isEqual(state, state)).toBe(true)
})

test('isEqual returns false when the layout changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    layout: {
      ...oldState.layout,
    },
  }

  expect(isEqual(oldState, newState)).toBe(false)
})

test('isEqual returns false when the width changes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    width: 800,
  }

  expect(isEqual(oldState, newState)).toBe(false)
})
