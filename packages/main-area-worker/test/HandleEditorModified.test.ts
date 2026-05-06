import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleEditorModified from '../src/parts/HandleEditorModified/HandleEditorModified.ts'

const createTab = (id: number, editorUid: number, title: string): Tab => {
  return {
    editorType: 'text',
    editorUid,
    icon: 'file-icon',
    id,
    isDirty: false,
    isPreview: false,
    title,
  }
}

test('handleEditorModified should return state unchanged when tab not found', () => {
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
          tabs: [createTab(1, 1, 'file1.ts')],
        },
      ],
    },
  }

  const result = HandleEditorModified.handleEditorModified(state, 999)

  expect(result).toBe(state)
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
})

test('handleEditorModified should set isDirty to true when tab is found', () => {
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
          tabs: [createTab(1, 1, 'file1.ts')],
        },
      ],
    },
  }

  const result = HandleEditorModified.handleEditorModified(state, 1)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
})

test('handleEditorModified should find tab by editorUid across groups', () => {
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
          tabs: [createTab(1, 1, 'file1.ts')],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(2, 2, 'file2.ts')],
        },
      ],
    },
  }

  const result = HandleEditorModified.handleEditorModified(state, 2)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(false)
  expect(result.layout.groups[1].tabs[0].isDirty).toBe(true)
})

test('handleEditorModified should preserve other tab properties when setting isDirty', () => {
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
              icon: 'my-icon',
              id: 1,
              isDirty: false,
              isPreview: true,
              title: 'myfile.ts',
            },
          ],
        },
      ],
    },
  }

  const result = HandleEditorModified.handleEditorModified(state, 1)

  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(result.layout.groups[0].tabs[0].icon).toBe('my-icon')
  expect(result.layout.groups[0].tabs[0].isPreview).toBe(true)
  expect(result.layout.groups[0].tabs[0].title).toBe('myfile.ts')
})
