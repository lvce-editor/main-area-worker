import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleSashCornerPointerDown } from '../src/parts/HandleSashCornerPointerDown/HandleSashCornerPointerDown.ts'
import { handleSashCornerPointerMove } from '../src/parts/HandleSashCornerPointerMove/HandleSashCornerPointerMove.ts'
import { handleSashCornerPointerUp } from '../src/parts/HandleSashCornerPointerUp/HandleSashCornerPointerUp.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

const createGridState = (): MainAreaState => ({
  ...createDefaultState(),
  height: 800,
  layout: {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: true,
        id: 1,
        isEmpty: true,
        segmentId: 1,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 2,
        isEmpty: true,
        segmentId: 1,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 3,
        isEmpty: true,
        segmentId: 2,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 4,
        isEmpty: true,
        segmentId: 2,
        size: 25,
        tabs: [],
      },
    ],
  },
  width: 1000,
})

test('handleSashCornerPointerDown should start a two-axis grid drag', async () => {
  const result = await handleSashCornerPointerDown(createGridState(), 500, 400)

  expect(result.sashCornerDrag).toEqual({
    groupSizes: [
      { id: 1, size: 25 },
      { id: 2, size: 25 },
      { id: 3, size: 25 },
      { id: 4, size: 25 },
    ],
    startClientX: 500,
    startClientY: 400,
    xAfterGroupIds: [3, 4],
    xBeforeGroupIds: [1, 2],
    yAfterGroupIds: [2, 4],
    yBeforeGroupIds: [1, 3],
  })
})

test('handleSashCornerPointerDown should ignore invalid pointer coordinates', async () => {
  const state = createGridState()
  const result = await handleSashCornerPointerDown(state, NaN, 400)

  expect(result).toBe(state)
})

test('handleSashCornerPointerDown should ignore layouts without a corner', async () => {
  const state = createGridState()
  const result = await handleSashCornerPointerDown(
    {
      ...state,
      layout: {
        ...state.layout,
        groups: state.layout.groups.slice(0, 1),
      },
    },
    500,
    400,
  )

  expect(result.sashCornerDrag).toBeUndefined()
})

test('handleSashCornerPointerMove should shrink both left panes when moving left', async () => {
  const state = await handleSashCornerPointerDown(createGridState(), 500, 400)
  const result = await handleSashCornerPointerMove(state, 400, 400)

  expect(result.layout.groups.map((group) => group.size)).toEqual([20, 20, 30, 30])
})

test('handleSashCornerPointerMove should resize all four panes along both axes', async () => {
  const state = await handleSashCornerPointerDown(createGridState(), 500, 400)
  const result = await handleSashCornerPointerMove(state, 600, 480)

  expect(result.layout.groups.map((group) => group.size)).toEqual([36, 24, 24, 16])
})

test('handleSashCornerPointerMove should clamp columns and rows to minimum sizes', async () => {
  const state = await handleSashCornerPointerDown(createGridState(), 500, 400)
  const result = await handleSashCornerPointerMove(state, -1000, -1000)

  expect(result.layout.groups.map((group) => group.size)).toEqual([2.5, 22.5, 7.5, 67.5])
})

test('handleSashCornerPointerMove should return the original state without an active drag', async () => {
  const state = createGridState()
  const result = await handleSashCornerPointerMove(state, 400, 400)

  expect(result).toBe(state)
})

test('handleSashCornerPointerUp should clear the grid drag', async () => {
  const state = await handleSashCornerPointerDown(createGridState(), 500, 400)
  const result = await handleSashCornerPointerUp(state)

  expect(result.sashCornerDrag).toBeUndefined()
})
