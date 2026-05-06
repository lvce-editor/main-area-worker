import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SplitLeft from '../src/parts/SplitLeft/SplitLeft.ts'

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

test('splitLeft should return state unchanged when group does not exist', () => {
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

  const result = SplitLeft.splitLeft(state, 999)

  expect(result.layout).toEqual(state.layout)
})

test('splitLeft should split single editor group horizontally', () => {
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

  const result = SplitLeft.splitLeft(state, 1)
  const newGroupId = result.layout.groups[0].id

  expect(result.layout.direction).toBe(1)
  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result.layout.activeGroupId).toBe(newGroupId)
})

test('splitLeft should preserve tabs in the original group', () => {
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

  const result = SplitLeft.splitLeft(state, 1)

  expect(result.layout.groups[1].tabs).toHaveLength(2)
  expect(result.layout.groups[1].tabs[0].id).toBe(1)
  expect(result.layout.groups[1].tabs[1].id).toBe(2)
})

test('splitLeft should use activeGroupId when groupId not provided', () => {
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

  const result = SplitLeft.splitLeft(state)

  expect(result.layout.groups.length).toBe(3)
})

test('splitLeft with empty groups should create initial group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 1,
      groups: [],
    },
  }

  const result = SplitLeft.splitLeft(state)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].isEmpty).toBe(true)
  expect(result.layout.groups[1].isEmpty).toBe(true)
})

test('splitLeft should set new group as focused', () => {
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

  const result = SplitLeft.splitLeft(state, 1)

  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[1].focused).toBe(false)
})
