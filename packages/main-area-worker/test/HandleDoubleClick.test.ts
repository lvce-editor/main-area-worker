import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDoubleClick } from '../src/parts/HandleDoubleClick/HandleDoubleClick.ts'

const createTab = (id: number, isPreview: boolean): Tab => {
  return {
    editorType: 'text',
    editorUid: id,
    icon: '',
    id,
    isDirty: false,
    isPreview,
    title: `File ${id}`,
    uri: `file:///file-${id}.txt`,
  }
}

const createState = (): MainAreaState => {
  return {
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
          tabs: [createTab(1, true), createTab(2, false)],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [createTab(3, true)],
        },
      ],
    },
  }
}

test('handleDoubleClick should pin a preview tab', () => {
  const result = handleDoubleClick(createState(), '0', '0')

  expect(result.layout.groups[0].tabs[0].isPreview).toBe(false)
})

test('handleDoubleClick should pin an inactive preview tab', () => {
  const result = handleDoubleClick(createState(), '1', '0')

  expect(result.layout.groups[1].tabs[0].isPreview).toBe(false)
  expect(result.layout.activeGroupId).toBe(1)
})

test('handleDoubleClick should return the same state for a pinned tab', () => {
  const state = createState()
  const result = handleDoubleClick(state, '0', '1')

  expect(result).toBe(state)
})

test('handleDoubleClick should return the same state for invalid indices', () => {
  const state = createState()

  expect(handleDoubleClick(state, '3', '0')).toBe(state)
  expect(handleDoubleClick(state, '0', '3')).toBe(state)
})

test('handleDoubleClick should return the same state for missing indices', () => {
  const state = createState()

  expect(handleDoubleClick(state, '', '0')).toBe(state)
  expect(handleDoubleClick(state, '0', '')).toBe(state)
})

test('handleDoubleClick should not mutate the original state', () => {
  const state = createState()

  handleDoubleClick(state, '0', '0')

  expect(state.layout.groups[0].tabs[0].isPreview).toBe(true)
})
