import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeTabsByUris } from '../src/parts/CloseTabsByUris/CloseTabsByUris.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeTabsByUris should remove tabs with matching uris', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
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
              title: 'Delete Me',
              uri: '/workspace/delete-me.ts',
            },
            {
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'Keep Me',
              uri: '/workspace/keep-me.ts',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsByUris(state, ['/workspace/delete-me.ts'])

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].uri).toBe('/workspace/keep-me.ts')
  expect(result.layout.groups[0].activeTabId).toBe(2)
})

test('closeTabsByUris should remove empty groups after closing the last tab', () => {
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
              title: 'Delete Me',
              uri: '/workspace/delete-me.ts',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsByUris(state, ['/workspace/delete-me.ts'])

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBe(-1)
})
