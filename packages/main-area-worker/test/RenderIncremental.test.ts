import { expect, test } from '@jest/globals'
import { PatchType } from '@lvce-editor/constants'
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

test('renderIncremental should add the drag overlay to the main area', () => {
  expect(renderIncremental(state, stateWithOverlay)).toEqual([
    'Viewlet.setPatches',
    2,
    [
      { index: 0, type: PatchType.NavigateChild },
      { type: PatchType.NavigateParent },
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

test('renderIncremental should remove the drag overlay from the main area', () => {
  expect(renderIncremental(stateWithOverlay, state)).toEqual(['Viewlet.setPatches', 2, [{ index: 1, type: 9 }]])
})
