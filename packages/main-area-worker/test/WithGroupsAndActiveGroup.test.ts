import { expect, test } from '@jest/globals'
import type { MainAreaState, EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as WithGroupsAndActiveGroup from '../src/parts/WithGroupsAndActiveGroup/WithGroupsAndActiveGroup.ts'

test('withGroupsAndActiveGroup should replace groups and activeGroupId', () => {
  const state: MainAreaState = createDefaultState()

  const newGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 5,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = WithGroupsAndActiveGroup.withGroupsAndActiveGroup(state, [newGroup], 5)

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0]).toBe(newGroup)
  expect(result.layout.activeGroupId).toBe(5)
})

test('withGroupsAndActiveGroup should set activeGroupId to undefined', () => {
  const state: MainAreaState = createDefaultState()

  const newGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = WithGroupsAndActiveGroup.withGroupsAndActiveGroup(state, [newGroup], undefined)

  expect(result.layout.activeGroupId).toBeUndefined()
})

test('withGroupsAndActiveGroup should replace multiple groups', () => {
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

  const result = WithGroupsAndActiveGroup.withGroupsAndActiveGroup(state, [group1, group2], 2)

  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0]).toBe(group1)
  expect(result.layout.groups[1]).toBe(group2)
  expect(result.layout.activeGroupId).toBe(2)
})

test('withGroupsAndActiveGroup should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    width: 1280,
    height: 720,
    uid: 99,
    workspaceuri: '/workspace/my-project',
  }

  const newGroup: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = WithGroupsAndActiveGroup.withGroupsAndActiveGroup(state, [newGroup], 1)

  expect(result.width).toBe(1280)
  expect(result.height).toBe(720)
  expect(result.uid).toBe(99)
  expect(result.workspaceuri).toBe('/workspace/my-project')
})

test('withGroupsAndActiveGroup should replace direction', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 2,
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

  const result = WithGroupsAndActiveGroup.withGroupsAndActiveGroup(state, [newGroup], 1)

  expect(result.layout.direction).toBe(2)
})

test('withGroupsAndActiveGroup should handle empty groups array', () => {
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

  const result = WithGroupsAndActiveGroup.withGroupsAndActiveGroup(state, [], undefined)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})
