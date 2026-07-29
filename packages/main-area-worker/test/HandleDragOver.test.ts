import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDragOver } from '../src/parts/HandleDragOver/HandleDragOver.ts'

test('handleDragOver should show the overlay', () => {
  const state = {
    ...createDefaultState(),
    height: 600,
    width: 800,
  }
  expect(handleDragOver(state, 400, 300)).toEqual({
    ...state,
    dragOverlay: {
      height: 600,
      width: 800,
      x: 0,
      y: 0,
    },
  })
})

test('handleDragOver should return the same state when the overlay is unchanged', () => {
  const state = {
    ...createDefaultState(),
    dragOverlay: {
      height: 600,
      width: 800,
      x: 0,
      y: 0,
    },
    height: 600,
    width: 800,
  }
  expect(handleDragOver(state, 400, 300)).toBe(state)
})
