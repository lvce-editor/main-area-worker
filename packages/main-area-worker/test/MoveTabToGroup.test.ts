import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MoveTabToGroup from '../src/parts/MoveTabToGroup/MoveTabToGroup.ts'

const createTab = (id: number, title: string): Tab => {
  return {
    editorUid: id,
    icon: '',
    id,
    isDirty: false,
    isPreview: false,
    title,
  }
}

test('moveTabToGroup should return state unchanged when source group does not exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 999, 1, 1)

  expect(result).toBe(state)
})

test('moveTabToGroup should return state unchanged when target group does not exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 999, 1)

  expect(result).toBe(state)
})

test('moveTabToGroup should return state unchanged when source and target are the same without a target index', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 1, 1)

  expect(result).toBe(state)
})

test('moveTabToGroup should reorder a tab to the start of its group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts'), createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 1, 2, 0)

  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([2, 1, 3])
  expect(result.layout.groups[0].activeTabId).toBe(2)
})

test('moveTabToGroup should reorder a tab to the end of its group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts'), createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 1, 1, 3)

  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([2, 3, 1])
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('moveTabToGroup should reorder the last tab into the middle of its group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 3,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts'), createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 1, 3, 1)

  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([1, 3, 2])
})

test('moveTabToGroup should return the same state when a same-group drop keeps the same order', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts'), createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  expect(MoveTabToGroup.moveTabToGroup(state, 1, 1, 2, 1)).toBe(state)
  expect(MoveTabToGroup.moveTabToGroup(state, 1, 1, 2, 2)).toBe(state)
})

test('moveTabToGroup should preserve unrelated groups during a same-group reorder', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
        {
          activeTabId: 3,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 1, 2, 0)

  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([2, 1])
  expect(result.layout.groups[1]).toBe(state.layout.groups[1])
})

test('moveTabToGroup should preserve groups unrelated to a cross-group move', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        { activeTabId: 1, direction: 1, focused: true, id: 1, isEmpty: false, size: 34, tabs: [createTab(1, 'file1.ts')] },
        { activeTabId: 2, direction: 1, focused: false, id: 2, isEmpty: false, size: 33, tabs: [createTab(2, 'file2.ts')] },
        { activeTabId: 3, direction: 1, focused: false, id: 3, isEmpty: false, size: 33, tabs: [createTab(3, 'file3.ts')] },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 2, 1, 0)

  expect(result.layout.groups[1].tabs.map((tab) => tab.id)).toEqual([1, 2])
  expect(result.layout.groups[2]).toBe(state.layout.groups[2])
})

test('moveTabToGroup should return state unchanged when tab does not exist in source group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts')],
        },
        {
          activeTabId: 2,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 2, 999)

  expect(result).toBe(state)
})

test('moveTabToGroup should move tab to target group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
        {
          activeTabId: 3,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 2, 1)

  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(2)
  expect(result.layout.groups[1].tabs).toHaveLength(2)
  expect(result.layout.groups[1].tabs[1].id).toBe(1)
  expect(result.layout.activeGroupId).toBe(2)
})

test('moveTabToGroup should update active tab when moving the active tab', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts'), createTab(2, 'file2.ts')],
        },
        {
          activeTabId: 3,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 2, 1)

  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[1].activeTabId).toBe(1)
})

test('moveTabToGroup should set source group to empty when last tab is moved', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts')],
        },
        {
          activeTabId: 2,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 2, 1)

  expect(result.layout.groups[0].isEmpty).toBe(true)
  expect(result.layout.groups[0].activeTabId).toBe(-1)
})

test('moveTabToGroup should insert tab at specific index when targetIndex is provided', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts')],
        },
        {
          activeTabId: 2,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(2, 'file2.ts'), createTab(3, 'file3.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 2, 1, 0)

  expect(result.layout.groups[1].tabs[0].id).toBe(1)
  expect(result.layout.groups[1].tabs[1].id).toBe(2)
  expect(result.layout.groups[1].tabs[2].id).toBe(3)
})

test('moveTabToGroup should set active tab in target group to moved tab', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [createTab(1, 'file1.ts')],
        },
        {
          activeTabId: 2,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(2, 'file2.ts')],
        },
      ],
    },
  }

  const result = MoveTabToGroup.moveTabToGroup(state, 1, 2, 1)

  expect(result.layout.groups[1].activeTabId).toBe(1)
})
