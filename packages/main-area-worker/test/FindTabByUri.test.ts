import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { findTabByUri } from '../src/parts/FindTabByUri/FindTabByUri.ts'

test('findTabByUri should return tab and groupId when found', () => {
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
              content: 'content1',
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
              uri: '/path/to/file1',
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
              content: 'content2',
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
              uri: '/path/to/file2',
            },
          ],
        },
      ],
    },
  }
  const result = findTabByUri(state, '/path/to/file2')
  expect(result).toBeDefined()
  expect(result?.tab.id).toBe(2)
  expect(result?.groupId).toBe(2)
})

test('findTabByUri should return undefined when not found', () => {
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
              content: 'content',
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File',
              uri: '/path/to/file',
            },
          ],
        },
      ],
    },
  }
  const result = findTabByUri(state, '/path/to/nonexistent')
  expect(result).toBeUndefined()
})
