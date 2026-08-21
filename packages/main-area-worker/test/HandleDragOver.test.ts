import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as EditorSplitDirection from '../src/parts/EditorSplitDirection/EditorSplitDirection.ts'
import { handleDragOver } from '../src/parts/HandleDragOver/HandleDragOver.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

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
      splitDirection: EditorSplitDirection.None,
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
      splitDirection: EditorSplitDirection.None,
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
  ['left', 0, 300, { height: 600, splitDirection: EditorSplitDirection.Left, width: 400, x: 0, y: 0 }],
  ['right', 800, 300, { height: 600, splitDirection: EditorSplitDirection.Right, width: 400, x: 400, y: 0 }],
  ['top', 400, 0, { height: 300, splitDirection: EditorSplitDirection.Up, width: 800, x: 0, y: 0 }],
  ['bottom', 400, 600, { height: 300, splitDirection: EditorSplitDirection.Down, width: 800, x: 0, y: 300 }],
])('handleDragOver should move the overlay to the %s region', (_name, eventX, eventY, dragOverlay) => {
  const state = {
    ...createDefaultState(),
    dragOverlay: {
      height: 600,
      splitDirection: EditorSplitDirection.None,
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
  ['left', 10, 300, { height: 600, splitDirection: EditorSplitDirection.Left, width: 400, x: 0, y: 0 }],
  ['right', 790, 300, { height: 600, splitDirection: EditorSplitDirection.Right, width: 400, x: 400, y: 0 }],
  ['top', 400, 10, { height: 300, splitDirection: EditorSplitDirection.Up, width: 800, x: 0, y: 0 }],
  ['bottom', 400, 590, { height: 300, splitDirection: EditorSplitDirection.Down, width: 800, x: 0, y: 300 }],
])('handleDragOver should preserve state while remaining in the %s region', (_name, eventX, eventY, dragOverlay) => {
  const state = {
    ...createDefaultState(),
    dragOverlay,
    height: 600,
    width: 800,
  }

  expect(handleDragOver(state, eventX, eventY)).toBe(state)
})

test('handleDragOver should show the overlay over the editor group under the pointer', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 600,
    layout: {
      activeGroupId: 1,
      direction: LayoutDirection.Horizontal,
      groups: [
        {
          activeTabId: 1,
          direction: LayoutDirection.Horizontal,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: 2,
          direction: LayoutDirection.Horizontal,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [],
        },
      ],
    },
    width: 800,
  }

  expect(handleDragOver(state, 600, 300)).toEqual({
    ...state,
    dragOverlay: {
      height: 565,
      splitDirection: EditorSplitDirection.None,
      targetGroupId: 2,
      width: 400,
      x: 400,
      y: 35,
    },
  })
})

test('handleDragOver should show a half overlay on the right of the editor group under the pointer', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 600,
    layout: {
      activeGroupId: 1,
      direction: LayoutDirection.Horizontal,
      groups: [
        {
          activeTabId: 1,
          direction: LayoutDirection.Horizontal,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: 2,
          direction: LayoutDirection.Horizontal,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [],
        },
      ],
    },
    width: 800,
  }

  expect(handleDragOver(state, 790, 300)).toEqual({
    ...state,
    dragOverlay: {
      height: 565,
      splitDirection: EditorSplitDirection.Right,
      targetGroupId: 2,
      width: 200,
      x: 600,
      y: 35,
    },
  })
})

test('handleDragOver should resolve an editor group in a nested layout', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 600,
    layout: {
      activeGroupId: 1,
      direction: LayoutDirection.Horizontal,
      groups: [
        {
          activeTabId: 1,
          direction: LayoutDirection.Horizontal,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: 2,
          direction: LayoutDirection.Vertical,
          focused: false,
          id: 2,
          isEmpty: false,
          segmentId: 2,
          size: 25,
          tabs: [],
        },
        {
          activeTabId: 3,
          direction: LayoutDirection.Vertical,
          focused: false,
          id: 3,
          isEmpty: false,
          segmentId: 2,
          size: 25,
          tabs: [],
        },
      ],
    },
    width: 800,
  }

  expect(handleDragOver(state, 600, 450)).toEqual({
    ...state,
    dragOverlay: {
      height: 265,
      splitDirection: EditorSplitDirection.None,
      targetGroupId: 3,
      width: 400,
      x: 400,
      y: 335,
    },
  })
})
