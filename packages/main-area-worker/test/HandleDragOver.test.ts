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

test.each([
  ['left', 0, 300, { height: 600, width: 400, x: 0, y: 0 }],
  ['right', 800, 300, { height: 600, width: 400, x: 400, y: 0 }],
  ['top', 400, 0, { height: 300, width: 800, x: 0, y: 0 }],
  ['bottom', 400, 600, { height: 300, width: 800, x: 0, y: 300 }],
])('handleDragOver should move the overlay to the %s region', (_name, eventX, eventY, dragOverlay) => {
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

  expect(handleDragOver(state, eventX, eventY)).toEqual({
    ...state,
    dragOverlay,
  })
})

test.each([
  ['left', 10, 300, { height: 600, width: 400, x: 0, y: 0 }],
  ['right', 790, 300, { height: 600, width: 400, x: 400, y: 0 }],
  ['top', 400, 10, { height: 300, width: 800, x: 0, y: 0 }],
  ['bottom', 400, 590, { height: 300, width: 800, x: 0, y: 300 }],
])('handleDragOver should preserve state while remaining in the %s region', (_name, eventX, eventY, dragOverlay) => {
  const state = {
    ...createDefaultState(),
    dragOverlay,
    height: 600,
    width: 800,
  }

  expect(handleDragOver(state, eventX, eventY)).toBe(state)
})
