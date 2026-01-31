import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import { getTabIndex } from '../src/parts/GetTabIndex/GetTabIndex.ts'

test('getTabIndex should return correct index when tab exists', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
    id: 1,,
    isEmpty: false
    size: 100,
    tabs: [
      {
        editorType: 'text',
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        title: 'File 1',
      },
      {
        editorType: 'text',
        editorUid: -1,
        icon: '',
        id: 2,
        isDirty: false,
        title: 'File 2',
      },
      {
        editorType: 'text',
        editorUid: -1,
        icon: '',
        id: 3,
        isDirty: false,
        title: 'File 3',
      },
    ],
  }
  expect(getTabIndex(group, 1)).toBe(0)
  expect(getTabIndex(group, 2)).toBe(1)
  expect(getTabIndex(group, 3)).toBe(2)
})

test('getTabIndex should return -1 when tab does not exist', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
    id: 1,,
    isEmpty: false
    size: 100,
    tabs: [
      {
        editorType: 'text',
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        title: 'File',
      },
    ],
  }
  expect(getTabIndex(group, 999)).toBe(-1)
})
