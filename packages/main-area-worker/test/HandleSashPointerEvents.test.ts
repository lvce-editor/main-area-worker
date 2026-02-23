import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleSashPointerDown } from '../src/parts/HandleSashPointerDown/HandleSashPointerDown.ts'
import { handleSashPointerMove } from '../src/parts/HandleSashPointerMove/HandleSashPointerMove.ts'
import { handleSashPointerUp } from '../src/parts/HandleSashPointerUp/HandleSashPointerUp.ts'

test('handleSashPointerDown should start sash drag', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
    width: 1000,
  }

  const result = await handleSashPointerDown(state, '1:2', 100, 200)

  expect(result.sashDrag).toEqual({
    afterGroupId: 2,
    afterSize: 50,
    beforeGroupId: 1,
    beforeSize: 50,
    sashId: '1:2',
    startClientX: 100,
    startClientY: 200,
  })
})

test('handleSashPointerMove should resize neighboring groups', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
    sashDrag: {
      afterGroupId: 2,
      afterSize: 50,
      beforeGroupId: 1,
      beforeSize: 50,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 200,
    },
    width: 1000,
  }

  const result = await handleSashPointerMove(state, 300, 200)

  expect(result.layout.groups[0].size).toBe(70)
  expect(result.layout.groups[1].size).toBe(30)
})

test('handleSashPointerUp should clear sash drag state', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    sashDrag: {
      afterGroupId: 2,
      afterSize: 50,
      beforeGroupId: 1,
      beforeSize: 50,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 200,
    },
  }

  const result = await handleSashPointerUp(state)

  expect(result.sashDrag).toBeUndefined()
})
