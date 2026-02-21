import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleSashPointerMove } from '../src/parts/HandleSashPointerMove/HandleSashPointerMove.ts'

const createBaseState = (): MainAreaState => {
  return {
    ...createDefaultState(),
    height: 800,
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 40,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 40,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          isEmpty: true,
          size: 20,
          tabs: [],
        },
      ],
    },
    width: 1000,
  }
}

test('handleSashPointerMove should return original state when sash drag is missing', async () => {
  const state = createBaseState()

  const result = await handleSashPointerMove(state, 200, 100)

  expect(result).toBe(state)
})

test('handleSashPointerMove should return original state for invalid pointer values', async () => {
  const state: MainAreaState = {
    ...createBaseState(),
    sashDrag: {
      afterGroupId: 2,
      afterSize: 40,
      beforeGroupId: 1,
      beforeSize: 40,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 200,
    },
  }

  const result = await handleSashPointerMove(state, Number.NaN, 200)

  expect(result).toBe(state)
})

test('handleSashPointerMove should return original state when axis size is zero', async () => {
  const state: MainAreaState = {
    ...createBaseState(),
    sashDrag: {
      afterGroupId: 2,
      afterSize: 40,
      beforeGroupId: 1,
      beforeSize: 40,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 200,
    },
    width: 0,
  }

  const result = await handleSashPointerMove(state, 300, 200)

  expect(result).toBe(state)
})

test('handleSashPointerMove should resize horizontal neighbor groups and preserve unrelated groups', async () => {
  const state: MainAreaState = {
    ...createBaseState(),
    sashDrag: {
      afterGroupId: 2,
      afterSize: 40,
      beforeGroupId: 1,
      beforeSize: 40,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 200,
    },
  }

  const result = await handleSashPointerMove(state, 300, 200)

  expect(result).not.toBe(state)
  expect(result.layout.groups[0].size).toBe(55)
  expect(result.layout.groups[1].size).toBe(25)
  expect(result.layout.groups[2].size).toBe(20)
})

test('handleSashPointerMove should clamp before group to minimum size', async () => {
  const state: MainAreaState = {
    ...createBaseState(),
    sashDrag: {
      afterGroupId: 2,
      afterSize: 40,
      beforeGroupId: 1,
      beforeSize: 40,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 200,
    },
  }

  const result = await handleSashPointerMove(state, -900, 200)

  expect(result.layout.groups[0].size).toBe(25)
  expect(result.layout.groups[1].size).toBe(55)
})

test('handleSashPointerMove should clamp after group to minimum size', async () => {
  const state: MainAreaState = {
    ...createBaseState(),
    sashDrag: {
      afterGroupId: 2,
      afterSize: 40,
      beforeGroupId: 1,
      beforeSize: 40,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 200,
    },
  }

  const result = await handleSashPointerMove(state, 1200, 200)

  expect(result.layout.groups[0].size).toBe(55)
  expect(result.layout.groups[1].size).toBe(25)
})

test('handleSashPointerMove should use vertical axis and round group sizes', async () => {
  const state: MainAreaState = {
    ...createBaseState(),
    height: 333,
    layout: {
      ...createBaseState().layout,
      direction: 'vertical',
    },
    sashDrag: {
      afterGroupId: 2,
      afterSize: 40,
      beforeGroupId: 1,
      beforeSize: 40,
      sashId: '1:2',
      startClientX: 100,
      startClientY: 100,
    },
  }

  const result = await handleSashPointerMove(state, 100, 101)

  expect(result.layout.groups[0].size).toBe(40)
  expect(result.layout.groups[1].size).toBe(40)
})
