import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { splitDown } from '../src/parts/SplitDown/SplitDown.ts'

test('splitDown should create and split an initial group', () => {
  const result = splitDown(createDefaultState())

  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.direction).toBe(2)
})

test('splitDown should use the active group when no group id is provided', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  expect(splitDown(state).layout.groups).toHaveLength(2)
})

test('splitDown should return unchanged state when neither group id is available', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: -1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: false,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  expect(splitDown(state)).toBe(state)
})

test('splitDown should return state unchanged when group does not exist', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitDown(state, 999)

  expect(result.layout).toEqual(state.layout)
})

test('splitDown should split a single editor group vertically', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitDown(state, 1)
  const newGroupId = result.layout.groups[1].id

  const expectedLayout = {
    activeGroupId: newGroupId,
    direction: 2,
    groups: [
      {
        activeTabId: -1,
        direction: 2,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 50,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: 2,
        focused: true,
        id: newGroupId,
        isEmpty: true,
        size: 50,
        tabs: [],
      },
    ],
  }

  expect(result.layout).toEqual(expectedLayout)
})

test('splitDown should preserve tabs in the original group', () => {
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
          tabs: [
            {
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File 1',
            },
            {
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = splitDown(state, 1)

  expect(result.layout.groups[0].tabs).toHaveLength(2)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[1].tabs).toHaveLength(0)
})

test('splitDown should split down with existing horizontal layout', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: -1,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const result = splitDown(state, 1)

  expect(result.layout.direction).toBe(1)
  expect(result.layout.groups).toHaveLength(3)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].size).toBe(25)
  expect(result.layout.groups[0].direction).toBe(2)
  expect(result.layout.groups[0].focused).toBe(false)
  expect(result.layout.groups[1].direction).toBe(2)
  expect(result.layout.groups[1].size).toBe(25)
  expect(result.layout.groups[1].focused).toBe(true)
  expect(result.layout.groups[2].id).toBe(2)
  expect(result.layout.groups[2].size).toBe(50)
})

test('splitDown should change layout direction from horizontal to vertical', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitDown(state, 1)

  expect(result.layout.direction).toBe(2)
})

test('splitDown should create a new group with empty tabs', () => {
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
          tabs: [
            {
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = splitDown(state, 1)

  const newGroup = result.layout.groups[1]
  expect(newGroup.tabs).toHaveLength(0)
  expect(newGroup.activeTabId).toBe(-1)
})

test('splitDown should focus the new group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitDown(state, 1)

  const newGroupId = result.layout.groups[1].id
  expect(result.layout.activeGroupId).toBe(newGroupId)
  expect(result.layout.groups[1].focused).toBe(true)
  expect(result.layout.groups[0].focused).toBe(false)
})

test('splitDown should redistribute group sizes correctly', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = splitDown(state, 1)

  const totalSize = result.layout.groups.reduce((sum, g) => sum + g.size, 0)
  expect(totalSize).toBe(100)
  expect(result.layout.groups[0].size).toBe(50)
  expect(result.layout.groups[1].size).toBe(50)
})

test('splitDown should not mutate original state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const originalGroupCount = state.layout.groups.length
  const result = splitDown(state, 1)

  expect(state.layout.groups).toHaveLength(originalGroupCount)
  expect(result.layout.groups).toHaveLength(originalGroupCount + 1)
})

test('splitDown should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 600,
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
    uid: 123,
    width: 800,
  }

  const result = splitDown(state, 1)

  expect(result.uid).toBe(123)
  expect(result.width).toBe(800)
  expect(result.height).toBe(600)
})
