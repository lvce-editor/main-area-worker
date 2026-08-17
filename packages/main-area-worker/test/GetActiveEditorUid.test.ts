import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getActiveEditorUid } from '../src/parts/GetActiveEditorUid/GetActiveEditorUid.ts'

const createState = (editorUid: number, focused = true): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 2,
        direction: 1,
        focused,
        id: 1,
        isEmpty: false,
        size: 100,
        tabs: [
          {
            editorType: 'text',
            editorUid,
            icon: '',
            id: 2,
            isDirty: false,
            isPreview: false,
            title: 'File',
          },
        ],
      },
    ],
  },
})

test('returns the active editor uid', () => {
  expect(getActiveEditorUid(createState(42))).toBe(42)
})

test('throws when no editor group is focused', () => {
  expect(() => getActiveEditorUid(createState(42, false))).toThrow('no active editor found')
})

test('throws while the active editor has no mounted view', () => {
  expect(() => getActiveEditorUid(createState(-1))).toThrow('no active editor found')
})
