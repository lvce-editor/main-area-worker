import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { hasOpenTextEditor } from '../src/parts/HasOpenTextEditor/HasOpenTextEditor.ts'

const createStateWithTabs = (tabs: readonly any[]): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs,
      },
    ],
  },
})

const createTab = (type: string, uri = 'file:///test'): any => ({
  editorInput: { type, uri },
  editorUid: 1,
  icon: '',
  id: 1,
  isDirty: false,
  isPreview: false,
  title: 'test',
})

test('hasOpenTextEditor - no tabs', () => {
  expect(hasOpenTextEditor(createDefaultState())).toBe(false)
})

test('hasOpenTextEditor - inactive text tab', () => {
  const state = createStateWithTabs([createTab('image'), createTab('editor', 'file:///image.png')])
  expect(hasOpenTextEditor(state)).toBe(true)
})

test('hasOpenTextEditor - text tab in another group', () => {
  const state = createStateWithTabs([createTab('image')])
  const group = state.layout.groups[0]
  const stateWithTextInOtherGroup: MainAreaState = {
    ...state,
    layout: {
      ...state.layout,
      groups: [...state.layout.groups, { ...group, id: 2, tabs: [createTab('editor')] }],
    },
  }
  expect(hasOpenTextEditor(stateWithTextInOtherGroup)).toBe(true)
})

test('hasOpenTextEditor - non-text tabs', () => {
  const state = createStateWithTabs(['image', 'video', 'diff', 'extension-detail-view'].map((type) => createTab(type)))
  expect(hasOpenTextEditor(state)).toBe(false)
})

test('hasOpenTextEditor - terminal tab', () => {
  const state = createStateWithTabs([{ ...createTab('editor'), terminal: true }])
  expect(hasOpenTextEditor(state)).toBe(false)
})
