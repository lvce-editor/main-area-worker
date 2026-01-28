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
          size: 100,
          tabs: [
            {
              content: '',
              editorType: 'text' as const,
              editorUid: -1,
              id: 1,
              isDirty: false,
              title: 'file1.txt',
              viewletRequestId: 100,
            },
            {
              content: '',
              editorType: 'text' as const,
              editorUid: -1,
              id: 2,
              isDirty: false,
              title: 'file2.txt',
              viewletRequestId: 200,
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = findTabByViewletRequestId(state, 200)

  expect(result).toBeDefined()
  expect(result?.id).toBe(2)
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
          size: 50,
          tabs: [
            {
              content: '',
              editorType: 'text' as const,
              editorUid: -1,
              id: 1,
              isDirty: false,
              title: 'file1.txt',
              viewletRequestId: 100,
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              content: '',
              editorType: 'text' as const,
              editorUid: -1,
              id: 2,
              isDirty: false,
              title: 'file2.txt',
              viewletRequestId: 200,
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = findTabByViewletRequestId(state, 200)

  expect(result).toBeDefined()
  expect(result?.id).toBe(2)
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
          size: 100,
          tabs: [
            {
              content: '',
              editorType: 'text' as const,
              editorUid: -1,
              id: 1,
              isDirty: false,
              title: 'file1.txt',
              viewletRequestId: 100,
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
