import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'

test('handleClick should return state unchanged when name is empty', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await HandleClick.handleClick(state, '')

  expect(result).toBe(state)
})

test('handleClick should return state unchanged when name is empty string', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await HandleClick.handleClick(state, '')

  expect(result).toBe(state)
})

test('handleClick should return state unchanged when name is provided', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await HandleClick.handleClick(state, 'someAction')

  expect(result).toBe(state)
})

test('handleClick should return the same state object', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          id: 1,
          isEmpty: false,
          isFocused: true,
          size: 100,
          tabs: [
            {
              editorUid: 1,
              icon: 'file-icon',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'test.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await HandleClick.handleClick(state, 'action')

  expect(result).toBe(state)
  expect(result.layout).toBe(state.layout)
})

test('handleClick should focus the group from the event target', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          id: 1,
          isEmpty: true,
          isFocused: false,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: 2,
          direction: 1,
          id: 2,
          isEmpty: false,
          isFocused: true,
          size: 50,
          tabs: [],
        },
      ],
    },
  }

  const result = await HandleClick.handleClick(state, '1')

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].isFocused).toBe(true)
  expect(result.layout.groups[1].isFocused).toBe(false)
})

test('handleClick should return the same state when the group does not exist', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await HandleClick.handleClick(state, '3')

  expect(result).toBe(state)
})
