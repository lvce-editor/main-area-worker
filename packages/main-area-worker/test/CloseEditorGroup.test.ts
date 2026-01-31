import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeEditorGroup } from '../src/parts/CloseEditorGroup/CloseEditorGroup.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeEditorGroup should return state unchanged when group does not exist', () => {
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
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 999)

  expect(result.layout).toEqual(state.layout)
})

test('closeEditorGroup should return state unchanged when there is only one group', () => {
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
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 1)

  expect(result.layout).toEqual(state.layout)
})

test('closeEditorGroup should close non-active group and redistribute sizes', () => {
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
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 2)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: true,
        id: 1,
        size: 100,
        tabs: [],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
})

test('closeEditorGroup should close active group and switch to first remaining group', () => {
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
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 1)

  const expectedLayout = {
    activeGroupId: 2,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        size: 100,
        tabs: [],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
})

test('closeEditorGroup should redistribute sizes evenly when closing one of three groups', () => {
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
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          size: 34,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 2)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: true,
        id: 1,
        size: 50,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 3,
        size: 50,
        tabs: [],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
})

test('closeEditorGroup should redistribute sizes evenly when closing one of four groups', () => {
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
          size: 25,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 25,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          size: 25,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 4,
          size: 25,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 3)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: true,
        id: 1,
        size: 33,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        size: 33,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 4,
        size: 34,
        tabs: [],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
})

test('closeEditorGroup should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test',
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 50,
          tabs: [],
        },
      ],
    },
    platform: 1,
    uid: 123,
  }

  const result = closeEditorGroup(state, 2)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'vertical',
    groups: [
      {
        activeTabId: undefined,
        focused: true,
        id: 1,
        size: 100,
        tabs: [],
      },
    ],
  }

  expect(result.assetDir).toBe('/test')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(123)
  expect(result.layout).toEqual(expectedLayout)
})

test('closeEditorGroup should handle closing middle group in three groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: true,
          id: 2,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          size: 34,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 2)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        size: 50,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 3,
        size: 50,
        tabs: [],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
})

test('closeEditorGroup should handle closing last group in three groups', () => {
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
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          size: 34,
          tabs: [],
        },
      ],
    },
  }

  const result = closeEditorGroup(state, 3)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: true,
        id: 1,
        size: 50,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        size: 50,
        tabs: [],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
})
