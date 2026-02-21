import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GroupDirection from '../src/parts/GroupDirection/GroupDirection.ts'
import { splitEditorGroup } from '../src/parts/SplitEditorGroup/SplitEditorGroup.ts'

test('splitEditorGroup should split editor group to the right', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].focused).toBe(true)
  expect(result.layout.groups[1].tabs.length).toBe(0)
  expect(result.layout.activeGroupId).toBe(result.layout.groups[1].id)
  expect(result.layout.direction).toBe('horizontal')
  expect(result).not.toBe(state)
})

test('splitEditorGroup should split editor group to the left', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Left)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[1].id).toBe(1)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result.layout.activeGroupId).toBe(result.layout.groups[0].id)
  expect(result.layout.direction).toBe('horizontal')
})

test('splitEditorGroup should split editor group down', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, 'down')

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].focused).toBe(true)
  expect(result.layout.groups[1].tabs.length).toBe(0)
  expect(result.layout.activeGroupId).toBe(result.layout.groups[1].id)
  expect(result.layout.direction).toBe('vertical')
})

test('splitEditorGroup should split editor group up', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, 'up')

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[0].tabs.length).toBe(0)
  expect(result.layout.groups[1].id).toBe(1)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[1].size).toBe(50)
  expect(result.layout.activeGroupId).toBe(result.layout.groups[0].id)
  expect(result.layout.direction).toBe('vertical')
})

test('splitEditorGroup should return unchanged state if group not found', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 999, GroupDirection.Right)

  expect(result).toBe(state)
  expect(result.layout.groups.length).toBe(1)
})

test('splitEditorGroup should preserve tabs in source group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result.layout.groups[0].tabs.length).toBe(3)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].tabs[1].id).toBe(2)
  expect(result.layout.groups[0].tabs[2].id).toBe(3)
  expect(result.layout.groups[1].tabs.length).toBe(0)
})

test('splitEditorGroup should create new group with unique id', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result1 = splitEditorGroup(state, 1, GroupDirection.Right)
  const result2 = splitEditorGroup(result1, 1, GroupDirection.Right)

  expect(result1.layout.groups[1].id).not.toBe(result2.layout.groups[2].id)
  expect(result2.layout.groups.length).toBe(3)
})

test('splitEditorGroup should set new group as focused', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result.layout.groups[1].focused).toBe(true)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.activeGroupId).toBe(result.layout.groups[1].id)
})

test('splitEditorGroup should set new group activeTabId to undefined', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result.layout.groups[1].activeTabId).toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('splitEditorGroup should split multiple existing groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result.layout.groups.length).toBe(3)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[1].id).toBe(2)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].focused).toBe(false)
  expect(result.layout.groups[2].focused).toBe(true)
  expect(result.layout.groups[0].size).toBeCloseTo(33.333333, 5)
  expect(result.layout.groups[1].size).toBeCloseTo(33.333333, 5)
  expect(result.layout.groups[2].size).toBeCloseTo(33.333334, 5)
  const totalSize = result.layout.groups.reduce((sum, group) => sum + group.size, 0)
  expect(totalSize).toBeCloseTo(100, 5)
})

test('splitEditorGroup should handle split of second group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 2, GroupDirection.Left)

  expect(result.layout.groups.length).toBe(3)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[1].focused).toBe(true)
  expect(result.layout.groups[1].tabs.length).toBe(0)
  expect(result.layout.groups[2].id).toBe(2)
  expect(result.layout.groups[2].focused).toBe(false)
  expect(result.layout.activeGroupId).toBe(result.layout.groups[1].id)
})

test('splitEditorGroup should set both source and new group size to 50', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].size).toBe(50)
})

test('splitEditorGroup should preserve activeTabId in source group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 42,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 42,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result.layout.groups[0].activeTabId).toBe(42)
})

test('splitEditorGroup should handle vertical direction string correctly for right split', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  // Right is horizontal, so direction should change to horizontal
  expect(result.layout.direction).toBe('horizontal')
})

test('splitEditorGroup should handle horizontal direction string correctly for up split', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, 'up')

  // Up is vertical, so direction should change to vertical
  expect(result.layout.direction).toBe('vertical')
})

test('splitEditorGroup should not mutate original state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const originalGroupsLength = state.layout.groups.length
  const originalGroupFocused = state.layout.groups[0].focused
  const originalGroupSize = state.layout.groups[0].size

  splitEditorGroup(state, 1, GroupDirection.Right)

  expect(state.layout.groups.length).toBe(originalGroupsLength)
  expect(state.layout.groups[0].focused).toBe(originalGroupFocused)
  expect(state.layout.groups[0].size).toBe(originalGroupSize)
})

test('splitEditorGroup should return new state object', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)

  expect(result).not.toBe(state)
  expect(result.layout).not.toBe(state.layout)
})

test('splitEditorGroup should update activeGroupId in result state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitEditorGroup(state, 1, GroupDirection.Right)
  const newGroupId = result.layout.groups[1].id

  expect(result.layout.activeGroupId).toBe(newGroupId)
})
