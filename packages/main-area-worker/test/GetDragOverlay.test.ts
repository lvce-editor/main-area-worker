import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getDragOverlay } from '../src/parts/GetDragOverlay/GetDragOverlay.ts'

const state = {
  ...createDefaultState(),
  height: 600,
  width: 800,
  x: 100,
  y: 50,
}

test('getDragOverlay should cover the main area when dragging over the center', () => {
  expect(getDragOverlay(state, 500, 350)).toEqual({
    height: 600,
    width: 800,
    x: 0,
    y: 0,
  })
})

test('getDragOverlay should cover the left half when dragging over the left edge', () => {
  expect(getDragOverlay(state, 150, 350)).toEqual({
    height: 600,
    width: 400,
    x: 0,
    y: 0,
  })
})

test('getDragOverlay should cover the right half when dragging over the right edge', () => {
  expect(getDragOverlay(state, 850, 350)).toEqual({
    height: 600,
    width: 400,
    x: 400,
    y: 0,
  })
})

test('getDragOverlay should cover the top half when dragging over the top edge', () => {
  expect(getDragOverlay(state, 500, 100)).toEqual({
    height: 300,
    width: 800,
    x: 0,
    y: 0,
  })
})

test('getDragOverlay should cover the bottom half when dragging over the bottom edge', () => {
  expect(getDragOverlay(state, 500, 600)).toEqual({
    height: 300,
    width: 800,
    x: 0,
    y: 300,
  })
})

test('getDragOverlay should exclude the tab bar when an editor is open', () => {
  const stateWithEditor: MainAreaState = {
    ...state,
    layout: {
      ...state.layout,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  expect(getDragOverlay(stateWithEditor, 500, 350)).toEqual({
    height: 565,
    width: 800,
    x: 0,
    y: 35,
  })
})
