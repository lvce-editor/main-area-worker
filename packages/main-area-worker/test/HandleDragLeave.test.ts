import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDragLeave } from '../src/parts/HandleDragLeave/HandleDragLeave.ts'

test('handleDragLeave should return the same state when no overlay is visible', () => {
  const state = createDefaultState()
  expect(handleDragLeave(state)).toBe(state)
})

test('handleDragLeave should hide the overlay', () => {
  const state = {
    ...createDefaultState(),
    dragOverlay: {
      height: 300,
      width: 400,
      x: 0,
      y: 0,
    },
  }
  expect(handleDragLeave(state)).toEqual({
    ...state,
    dragOverlay: undefined,
  })
})

test('handleDragLeave should preserve unrelated main area state when cancelling a drag', () => {
  const state = {
    ...createDefaultState(),
    dragOverlay: {
      height: 150,
      width: 200,
      x: 200,
      y: 150,
    },
    height: 300,
    uid: 42,
    width: 400,
  }

  expect(handleDragLeave(state)).toEqual({
    ...state,
    dragOverlay: undefined,
  })
})

test('handleDragLeave should make a second drag cancellation a no-op', () => {
  const state = {
    ...createDefaultState(),
    dragOverlay: {
      height: 150,
      width: 200,
      x: 0,
      y: 0,
    },
  }

  const cancelledState = handleDragLeave(state)

  expect(handleDragLeave(cancelledState)).toBe(cancelledState)
})
