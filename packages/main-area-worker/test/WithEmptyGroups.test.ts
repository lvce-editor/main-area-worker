import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as WithEmptyGroups from '../src/parts/WithEmptyGroups/WithEmptyGroups.ts'

test('withEmptyGroups should remove all groups', () => {
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

  const result = WithEmptyGroups.withEmptyGroups(state)

  expect(result.layout.groups).toHaveLength(0)
})

test('withEmptyGroups should set activeGroupId to undefined', () => {
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

  const result = WithEmptyGroups.withEmptyGroups(state)

  expect(result.layout.activeGroupId).toBeUndefined()
})

test('withEmptyGroups should clear multiple groups', () => {
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
          size: 50,
          tabs: [],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const result = WithEmptyGroups.withEmptyGroups(state)

  expect(result.layout.groups).toHaveLength(0)
})

test('withEmptyGroups should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    width: 800,
    height: 600,
    uid: 123,
    workspaceuri: '/my/workspace',
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

  const result = WithEmptyGroups.withEmptyGroups(state)

  expect(result.width).toBe(800)
  expect(result.height).toBe(600)
  expect(result.uid).toBe(123)
  expect(result.workspaceuri).toBe('/my/workspace')
})

test('withEmptyGroups on already empty state', () => {
  const state: MainAreaState = createDefaultState()

  const result = WithEmptyGroups.withEmptyGroups(state)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})
