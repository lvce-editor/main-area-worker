import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { findTabByViewletRequestId } from '../src/parts/FindTabByViewletRequestId/FindTabByViewletRequestId.ts'

test('findTabByViewletRequestId finds tab with matching requestId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = findTabByViewletRequestId(state, 200)

  expect(result).toBeUndefined()
})

test('findTabByViewletRequestId finds tab in second group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = findTabByViewletRequestId(state, 200)

  expect(result).toBeUndefined()
})

test('findTabByViewletRequestId returns undefined when not found', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = findTabByViewletRequestId(state, 999)

  expect(result).toBeUndefined()
})
