import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SplitUp from '../src/parts/SplitUp/SplitUp.ts'

const createTab = (id: number, title: string): Tab => {
  return {
    editorType: 'text',
    editorUid: id,
    icon: '',
    id,
    isDirty: false,
    isPreview: false,
    title,
  }
}

test('splitUp should return state unchanged when group does not exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = SplitUp.splitUp(state, 999)

  expect(result.layout).toEqual(state.layout)
})

test('splitUp should split single editor group vertically', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = SplitUp.splitUp(state, 1)

  expect(result.layout.direction).toBe(2)
  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].size).toBe(50)
})

test('splitUp should preserve tabs in the original group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = SplitUp.splitUp(state, 1)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups.some((g) => g.tabs.length === 2)).toBe(true)
})

test('splitUp should use activeGroupId when groupId not provided', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts')],
        },
        {
          activeTabId: 2,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = SplitUp.splitUp(state)

  expect(result.layout.groups.length).toBe(3)
})

test('splitUp should return unchanged state when activeGroupId is undefined and groupId not provided and groups exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 1,
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = SplitUp.splitUp(state)

  expect(result).toBe(state)
})

test('splitUp with empty groups should create initial group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 1,
      groups: [],
    },
  }

  const result = SplitUp.splitUp(state, 1)

  expect(result.layout.groups.length).toBeGreaterThan(0)
})

test('splitUp should set new group as focused', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = SplitUp.splitUp(state, 1)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups.some((g) => g.focused === true)).toBe(true)
})
