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
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
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
