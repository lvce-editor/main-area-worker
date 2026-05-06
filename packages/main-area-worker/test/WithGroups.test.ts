import { expect, test } from '@jest/globals'
import type { MainAreaState, EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as WithGroups from '../src/parts/WithGroups/WithGroups.ts'

test('withGroups should replace groups', () => {
  const state: MainAreaState = createDefaultState()

  const newGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = WithGroups.withGroups(state, [newGroup])

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0]).toBe(newGroup)
})

test('withGroups should replace multiple groups', () => {
  const state: MainAreaState = createDefaultState()

  const group1: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    isEmpty: true,
    size: 50,
    tabs: [],
  }

  const group2: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 2,
    isEmpty: true,
    size: 50,
    tabs: [],
  }

  const result = WithGroups.withGroups(state, [group1, group2])

  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0]).toBe(group1)
  expect(result.layout.groups[1]).toBe(group2)
})

test('withGroups should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    width: 1024,
    height: 768,
    uid: 42,
  }

  const newGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = WithGroups.withGroups(state, [newGroup])

  expect(result.width).toBe(1024)
  expect(result.height).toBe(768)
  expect(result.uid).toBe(42)
})

test('withGroups should replace with empty groups', () => {
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
          tabs: [],
        },
      ],
    },
  }

  const result = WithGroups.withGroups(state, [])

  expect(result.layout.groups).toHaveLength(0)
})

test('withGroups should preserve activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [],
    },
  }

  const newGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = WithGroups.withGroups(state, [newGroup])

  expect(result.layout.activeGroupId).toBe(2)
})
