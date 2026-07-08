import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { hasActiveTextEditor } from '../src/parts/HasActiveTextEditor/HasActiveTextEditor.ts'

test('hasActiveTextEditor - no active editor', () => {
  const state = createDefaultState()
  expect(hasActiveTextEditor(state)).toBe(false)
})

test('hasActiveTextEditor - active text editor', () => {
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
              editorInput: {
                type: 'editor',
                uri: 'file:///test.txt',
              },
              editorType: 'text',
              editorUid: 1,
              icon: '',
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
  expect(hasActiveTextEditor(state)).toBe(true)
})

test('hasActiveTextEditor - active non-text editor', () => {
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
              editorInput: {
                type: 'image',
                uri: 'file:///test.png',
              },
              editorType: 'custom',
              editorUid: 1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'test.png',
            },
          ],
        },
      ],
    },
  }
  expect(hasActiveTextEditor(state)).toBe(false)
})
