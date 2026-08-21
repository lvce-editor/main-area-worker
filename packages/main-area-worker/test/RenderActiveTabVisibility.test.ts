import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderActiveTabVisibility } from '../src/parts/RenderActiveTabVisibility/RenderActiveTabVisibility.ts'

test('renderActiveTabVisibility reveals the active tab', () => {
  const oldState = createDefaultState()
  const newState: MainAreaState = {
    ...oldState,
    layout: {
      activeGroupId: 12,
      direction: 1,
      groups: [
        {
          activeTabId: 42,
          direction: 1,
          focused: true,
          id: 12,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 1,
              icon: '',
              id: 42,
              isDirty: false,
              isPreview: false,
              title: 'active.txt',
              uri: 'file:///active.txt',
            },
          ],
        },
      ],
    },
    uid: 7,
  }

  expect(renderActiveTabVisibility(oldState, newState)).toEqual([
    'Viewlet.scrollSelectorIntoView',
    7,
    '.MainTab[data-group-index="0"][data-index="0"]',
  ])
})

test('renderActiveTabVisibility ignores a missing active group', () => {
  const state = createDefaultState()

  expect(renderActiveTabVisibility(state, state)).toEqual([])
})

test('renderActiveTabVisibility ignores a missing active tab', () => {
  const oldState = createDefaultState()
  const newState: MainAreaState = {
    ...oldState,
    layout: {
      activeGroupId: 12,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 12,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  expect(renderActiveTabVisibility(oldState, newState)).toEqual([])
})
