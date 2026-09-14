import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleFocus } from '../src/parts/HandleFocus/HandleFocus.ts'

const createSplitState = (): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: -1,
        direction: 1,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 50,
        tabs: [],
      },
      {
        activeTabId: 2,
        direction: 1,
        focused: true,
        id: 2,
        isEmpty: false,
        size: 50,
        tabs: [
          {
            editorUid: 2,
            icon: '',
            id: 2,
            isDirty: false,
            isPreview: false,
            title: 'README.md',
            uri: '/README.md',
          },
        ],
      },
    ],
  },
})

test('handleFocus should focus the group from the event target', () => {
  const state = createSplitState()

  const result = handleFocus(state, '1')

  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[1].focused).toBe(false)
})

test('handleFocus should return the same state when the group id is missing', () => {
  const state = createSplitState()

  const result = handleFocus(state)

  expect(result).toBe(state)
})

test('handleFocus should return the same state when the group does not exist', () => {
  const state = createSplitState()

  const result = handleFocus(state, '3')

  expect(result).toBe(state)
})
