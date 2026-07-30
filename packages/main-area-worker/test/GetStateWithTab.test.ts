import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getStateWithTab } from '../src/parts/GetStateWithTab/GetStateWithTab.ts'

const createState = (): MainAreaState => ({
  ...createDefaultState(),
  homeDirUri: 'file:///home/test',
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
            editorInput: {
              type: 'editor',
              uri: 'file:///home/test/old.ts',
            },
            editorType: 'text',
            editorUid: 1,
            errorMessage: 'failed',
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            loadingState: 'error',
            title: 'old.ts',
            uri: 'file:///home/test/old.ts',
          },
        ],
      },
    ],
  },
})

test('getStateWithTab resets and focuses a failed existing tab', () => {
  const state = createState()

  const result = getStateWithTab(
    state,
    { type: 'editor', uri: 'file:///home/test/old.ts' },
    { groupId: 1, tab: { id: 1 } },
    true,
    'file:///home/test/old.ts',
    false,
    'old.ts',
    'text',
  )

  expect(result.tabId).toBe(1)
  expect(result.stateWithTab.layout.groups[0].tabs[0]).toMatchObject({
    errorMessage: '',
    loadingState: 'loading',
    uriTitle: '~/old.ts',
  })
})

test('getStateWithTab creates a new tab when retry data is missing', () => {
  const state = {
    ...createState(),
    homeDirUri: '',
  }

  const result = getStateWithTab(state, { type: 'editor', uri: 'file:///new.ts' }, undefined, true, 'file:///new.ts', false, 'new.ts', 'text')

  expect(result.stateWithTab.layout.groups[0].tabs).toHaveLength(2)
  expect(result.tabId).toBe(result.stateWithTab.layout.groups[0].tabs[1].id)
  expect(result.stateWithTab.layout.groups[0].tabs[1].uriTitle).toBeUndefined()
})
