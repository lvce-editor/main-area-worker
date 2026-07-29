import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

const state = {
  ...createDefaultState(),
  height: 600,
  uid: 2,
  width: 800,
}

const stateWithOverlay = {
  ...state,
  dragOverlay: {
    height: 600,
    width: 800,
    x: 0,
    y: 0,
  },
}

test('renderIncremental should navigate into the main content before adding the drag overlay', () => {
  expect(renderIncremental(state, stateWithOverlay)).toEqual([
    'Viewlet.setPatches',
    2,
    [
      { index: 0, type: 7 },
      {
        nodes: [
          {
            childCount: 0,
            className: 'DragOverlay',
            type: 4,
          },
        ],
        type: 6,
      },
    ],
  ])
})

test('renderIncremental should navigate into the main content before removing the drag overlay', () => {
  expect(renderIncremental(stateWithOverlay, state)).toEqual([
    'Viewlet.setPatches',
    2,
    [
      { index: 0, type: 7 },
      { index: 0, type: 9 },
    ],
  ])
})
