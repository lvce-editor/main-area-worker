import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as EditorSplitDirection from '../src/parts/EditorSplitDirection/EditorSplitDirection.ts'
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
    splitDirection: EditorSplitDirection.None,
    width: 800,
    x: 0,
    y: 0,
  })
})

test('getDragOverlay should cover the left half when dragging over the left edge', () => {
  expect(getDragOverlay(state, 150, 350)).toEqual({
    height: 600,
    splitDirection: EditorSplitDirection.Left,
    width: 400,
    x: 0,
    y: 0,
  })
})

test('getDragOverlay should cover the right half when dragging over the right edge', () => {
  expect(getDragOverlay(state, 850, 350)).toEqual({
    height: 600,
    splitDirection: EditorSplitDirection.Right,
    width: 400,
    x: 400,
    y: 0,
  })
})

test('getDragOverlay should cover the top half when dragging over the top edge', () => {
  expect(getDragOverlay(state, 500, 100)).toEqual({
    height: 300,
    splitDirection: EditorSplitDirection.Up,
    width: 800,
    x: 0,
    y: 0,
  })
})

test('getDragOverlay should cover the bottom half when dragging over the bottom edge', () => {
  expect(getDragOverlay(state, 500, 600)).toEqual({
    height: 300,
    splitDirection: EditorSplitDirection.Down,
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
    splitDirection: EditorSplitDirection.None,
    targetGroupId: 1,
    width: 800,
    x: 0,
    y: 35,
  })
})

const fullOverlay = {
  height: 600,
  splitDirection: EditorSplitDirection.None,
  width: 800,
  x: 0,
  y: 0,
}

test.each([
  ['at the left boundary', 100, 350, { height: 600, splitDirection: EditorSplitDirection.Left, width: 400, x: 0, y: 0 }],
  ['just before the left threshold', 299, 350, { height: 600, splitDirection: EditorSplitDirection.Left, width: 400, x: 0, y: 0 }],
  ['at the left threshold', 300, 350, fullOverlay],
  ['just after the left threshold', 301, 350, fullOverlay],
  ['just before the right threshold', 699, 350, fullOverlay],
  ['at the right threshold', 700, 350, fullOverlay],
  ['just after the right threshold', 701, 350, { height: 600, splitDirection: EditorSplitDirection.Right, width: 400, x: 400, y: 0 }],
  ['at the right boundary', 900, 350, { height: 600, splitDirection: EditorSplitDirection.Right, width: 400, x: 400, y: 0 }],
  ['at the top boundary', 500, 50, { height: 300, splitDirection: EditorSplitDirection.Up, width: 800, x: 0, y: 0 }],
  ['just before the top threshold', 500, 199, { height: 300, splitDirection: EditorSplitDirection.Up, width: 800, x: 0, y: 0 }],
  ['at the top threshold', 500, 200, fullOverlay],
  ['just after the top threshold', 500, 201, fullOverlay],
  ['just before the bottom threshold', 500, 499, fullOverlay],
  ['at the bottom threshold', 500, 500, fullOverlay],
  ['just after the bottom threshold', 500, 501, { height: 300, splitDirection: EditorSplitDirection.Down, width: 800, x: 0, y: 300 }],
  ['at the bottom boundary', 500, 650, { height: 300, splitDirection: EditorSplitDirection.Down, width: 800, x: 0, y: 300 }],
  ['at the top-left corner', 100, 50, { height: 600, splitDirection: EditorSplitDirection.Left, width: 400, x: 0, y: 0 }],
  ['at the bottom-right corner', 900, 650, { height: 600, splitDirection: EditorSplitDirection.Right, width: 400, x: 400, y: 0 }],
])('getDragOverlay should position the overlay %s', (_name, eventX, eventY, expected) => {
  expect(getDragOverlay(state, eventX, eventY)).toEqual(expected)
})
