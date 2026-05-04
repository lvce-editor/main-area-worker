import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import { getFilteredGroups } from '../src/parts/GetFilteredGroups/GetFilteredGroups.ts'

test('getFilteredGroups should remove untitled tabs and preserve empty groups', () => {
  const groups: readonly EditorGroup[] = [
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
          isPreview: false,
          title: 'untitled',
          uri: 'untitled://Untitled-1',
        },
        {
          editorType: 'text',
          editorUid: -1,
          icon: '',
          id: 2,
          isDirty: false,
          isPreview: false,
          title: 'file.ts',
          uri: 'file:///workspace/file.ts',
        },
      ],
    },
    {
      activeTabId: 3,
      focused: false,
      id: 2,
      isEmpty: false,
      size: 50,
      tabs: [
        {
          editorType: 'text',
          editorUid: -1,
          icon: '',
          id: 3,
          isDirty: false,
          isPreview: false,
          title: 'untitled-2',
          uri: 'untitled://Untitled-2',
        },
      ],
    },
  ]

  const result = getFilteredGroups(groups)

  expect(result).toEqual([
    {
      activeTabId: 2,
      focused: true,
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
          isPreview: false,
          title: 'file.ts',
          uri: 'file:///workspace/file.ts',
        },
      ],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
      isEmpty: true,
      size: 50,
      tabs: [],
    },
  ])
})
