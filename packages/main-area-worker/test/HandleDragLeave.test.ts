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
